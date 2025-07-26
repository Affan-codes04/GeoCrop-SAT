import pandas as pd
import numpy as np
import skfuzzy as fuzz
import warnings

# Suppress specific non-critical warnings from skfuzzy
warnings.filterwarnings("ignore", message="Bad anchor points provided.*", category=RuntimeWarning)

class DataManager:
    """Handles all data loading, cleaning, and access operations."""
    def __init__(self, dataset_path):
        self.df = self._load_and_clean_data(dataset_path)

    def _load_and_clean_data(self, dataset_path):
        try:
            df = pd.read_csv(dataset_path)
            print("Dataset loaded successfully.")
        except FileNotFoundError:
            print(f"Error: Dataset not found at '{dataset_path}'.")
            return pd.DataFrame()

        df.columns = df.columns.str.strip()
        df['primary_name'] = df['COMNAME'].apply(lambda x: str(x).split(',')[0].strip().capitalize())
        
        num_cols = ['TMIN', 'TMAX', 'TOPMN', 'TOPMX', 'RMIN', 'RMAX', 'ROPMN', 
                    'ROPMX', 'PHMIN', 'PHMAX', 'PHOPMN', 'PHOPMX', 'ALTMX']
        for col in num_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')
        
        cat_cols = ['DRAR', 'DEPR', 'TEXTR', 'FERR', 'SALR', 'DRA', 'DEP', 'TEXT', 'FER', 'SAL']
        for col in cat_cols:
            df[col] = df[col].apply(lambda x: [i.strip().lower() for i in str(x).split(',')] if pd.notna(x) else [])
        
        print("Data preprocessing complete.")
        return df

    def get_all_crops(self):
        """Returns the entire cleaned DataFrame."""
        return self.df

    def get_crop_by_name(self, crop_name):
        """Retrieves a single crop's data by its primary name."""
        crop_row = self.df[self.df['primary_name'].str.lower() == crop_name.lower()]
        if not crop_row.empty:
            return crop_row.iloc[0]
        return None

class FuzzyCalculator:
    """Performs all fuzzy logic calculations for crop suitability."""
    def __init__(self):
        self._setup_categorical_maps()
        self.weights = {
            'Temperature': 1.0, 'Rainfall': 1.0, 'pH': 1.0,
            'Texture': 1.0, 'Drainage': 1.0, 'Depth': 1.0,
            'Fertility': 1.0, 'Salinity': 1.0,
        }
        self.param_env_key_map = {
            'Temperature': 'temperature', 'Rainfall': 'rainfall', 'pH': 'ph',
            'Texture': 'texture', 'Drainage': 'drainage', 'Depth': 'depth',
            'Fertility': 'fertility', 'Salinity': 'salinity'
        }

    def _setup_categorical_maps(self):
        """Creates the reclassification schema for categorical data."""
        self.texture_map = {'light': 8, 'organic': 9, 'wide': 7, 'medium': 10, 'heavy': 4}
        self.drainage_map = {'well': 10, 'good': 9, 'imperfect': 7, 'excessive': 5, 'poor': 2, 'very poor': 1}
        self.depth_map = {'deep': 10, 'very deep': 10, 'medium': 8, 'shallow': 5, 'very shallow': 2}
        self.fertility_map = {'high': 10, 'very high': 10, 'moderate': 8, 'medium': 8, 'low': 4, 'very low': 2}
        self.salinity_map = {'non-saline': 10, 'low': 9, 'medium': 5, 'high': 2, 'very high': 0}

    def _get_categorical_score(self, value, mapping):
        """Helper to get a numerical score for a categorical value."""
        value = value.lower()
        if value in mapping: return mapping[value]
        for k, v in mapping.items():
            if k in value: return v
        return 0

    def calculate_suitability(self, crop, env_params):
        """
        Calculates the final suitability score, dynamically excluding parameters 
        with missing data from either the environment or the crop's profile.
        """
        if not self._passes_boolean_gateway(crop, env_params):
            return None

        all_scores, missing_from_crop, missing_from_env = self._get_all_membership_scores(crop, env_params)
        
        valid_scores = {param: score for param, score in all_scores.items() if score is not None}
        
        if not valid_scores: return None

        weighted_sum = sum(self.weights[param] * score for param, score in valid_scores.items())
        total_weight = sum(self.weights[param] for param in valid_scores)

        if total_weight == 0: return None
            
        final_score = (weighted_sum / total_weight) * 100
        limiting_factor = min(valid_scores, key=valid_scores.get)
        
        missing_params_info = {
            "from_environment": missing_from_env,
            "from_crop_data": missing_from_crop
        }
        
        return {'score': final_score, 'limiting_factor': limiting_factor, 'missing_params_info': missing_params_info}

    def _passes_boolean_gateway(self, crop, env_params):
        """Applies hard constraints. Passes if data is missing from either source."""
        if 'temperature' in env_params and pd.notna(crop['TMIN']) and pd.notna(crop['TMAX']):
            if not (crop['TMIN'] <= env_params['temperature'] <= crop['TMAX']): return False
        if 'rainfall' in env_params and pd.notna(crop['RMIN']) and pd.notna(crop['RMAX']):
            if not (crop['RMIN'] <= env_params['rainfall'] <= crop['RMAX']): return False
        if 'ph' in env_params and pd.notna(crop['PHMIN']) and pd.notna(crop['PHMAX']):
            if not (crop['PHMIN'] <= env_params['ph'] <= crop['PHMAX']): return False
        if 'altitude' in env_params and pd.notna(crop['ALTMX']) and env_params['altitude'] > crop['ALTMX']: return False
        return True

    def _get_all_membership_scores(self, crop, env_params):
        """
        Calculates membership scores. Returns the scores and lists of parameters
        that were skipped due to missing data from the crop or environment.
        """
        scores = {}
        missing_from_crop = []
        missing_from_env = []
        universe_cat = np.arange(0, 11, 1)

        # --- Numerical Parameters ---
        param_defs = {
            'Temperature': ('temperature', [crop['TMIN'], crop['TOPMN'], crop['TOPMX'], crop['TMAX']], np.arange(0, 51, 1)),
            'Rainfall': ('rainfall', [crop['RMIN'], crop['ROPMN'], crop['ROPMX'], crop['RMAX']], np.arange(0, 5001, 10)),
            'pH': ('ph', [crop['PHMIN'], crop['PHOPMN'], crop['PHOPMX'], crop['PHMAX']], np.arange(0, 14.1, 0.1))
        }

        for param_name, (env_key, points, universe) in param_defs.items():
            if env_key not in env_params:
                scores[param_name] = None
                missing_from_env.append(param_name)
            elif any(pd.isna(p) for p in points) or not (points[0] <= points[1] <= points[2] <= points[3]):
                scores[param_name] = None
                missing_from_crop.append(param_name)
            else:
                scores[param_name] = fuzz.interp_membership(universe, fuzz.trapmf(universe, points), env_params[env_key])

        # --- Categorical Parameters ---
        cat_param_defs = {
            'Texture': ('texture', crop['TEXT'], self.texture_map),
            'Drainage': ('drainage', crop['DRA'], self.drainage_map),
            'Depth': ('depth', crop['DEP'], self.depth_map),
            'Fertility': ('fertility', crop['FER'], self.fertility_map),
            'Salinity': ('salinity', crop['SAL'], self.salinity_map)
        }

        for param_name, (env_key, optimal_list, score_map) in cat_param_defs.items():
            if env_key not in env_params:
                scores[param_name] = None
                missing_from_env.append(param_name)
            else:
                scores[param_name] = self._get_best_cat_membership(env_params[env_key], optimal_list, score_map, universe_cat)
                if scores[param_name] is None:
                    missing_from_crop.append(param_name)

        return scores, missing_from_crop, missing_from_env

    def _get_best_cat_membership(self, env_value, crop_optimal_list, score_map, universe):
        """Returns None if the crop has no optimal categories defined."""
        if not crop_optimal_list: return None
        
        env_score = self._get_categorical_score(env_value, score_map)
        max_membership = 0
        for optimal_cat in crop_optimal_list:
            ideal_score = self._get_categorical_score(optimal_cat, score_map)
            mf = fuzz.trimf(universe, [ideal_score - 3, ideal_score, ideal_score + 3])
            membership = fuzz.interp_membership(universe, mf, env_score)
            if membership > max_membership:
                max_membership = membership
        return max_membership
    
def classify_suitability(score):
    if score >= 80: return "S1 (Highly Suitable)"
    elif score >= 60: return "S2 (Moderately Suitable)"
    elif score >= 40: return "S3 (Marginally Suitable)"
    else: return "N (Not Suitable)"

class CropSuitabilitySystem:
    def __init__(self, dataset_path):
        self.data_manager = DataManager(dataset_path)
        self.calculator = FuzzyCalculator()

    def find_suitable_crops(self, env_params, top_n=6):
        all_crops = self.data_manager.get_all_crops()
        if all_crops.empty: return []
        
        results = []
        for _, crop in all_crops.iterrows():
            suitability_info = self.calculator.calculate_suitability(crop, env_params)
            if suitability_info and suitability_info.get('score', 0) > 0:
                results.append({'crop_name': crop['primary_name'], **suitability_info})
        
        return sorted(results, key=lambda x: x['score'], reverse=True)[:top_n]

    def get_crop_details(self, crop_name, env_params=None):
        crop_data = self.data_manager.get_crop_by_name(crop_name)
        if crop_data is None:
            return {'error': f"Crop '{crop_name}' not found."}

        details = crop_data.replace(np.nan, 'N/A').to_dict()
        if env_params:
            suitability_info = self.calculator.calculate_suitability(crop_data, env_params)
            if suitability_info:
                details.update(suitability_info)
            else:
                details['score'] = 0
                details['limiting_factor'] = 'Not suitable (fails hard constraints or has no valid data)'
                details['missing_params_info'] = {"from_environment": [], "from_crop_data": []}
        return details

if __name__ == '__main__':
    system = CropSuitabilitySystem('./indian_crops_filtered.csv')

    if not system.data_manager.df.empty:
        # Environment 1: All data provided
        env1 = {
            'temperature': 28, 'rainfall': 1600, 'ph': 6.5, 'altitude': 1000,
            'fertility': 'high', 'salinity': 'low', 'drainage': 'poor',
            'depth': 'medium', 'texture': 'medium'
        }
        # Environment 2: Missing 'rainfall' and 'drainage' to test new logic
        env2 = {
            'temperature': 25, 'ph': 7.2, 'altitude': 800,
            'fertility': 'medium', 'salinity': 'medium',
            'depth': 'shallow', 'texture': 'light'
        }

        for i, env in enumerate([env1, env2]):
            print("\n" + "="*20 + f" Scenario {i+1} " + "="*20)
            print(f"Input Parameters: {env}")
            top_crops = system.find_suitable_crops(env)
            print("\n--- Top 6 Recommended Crops ---")
            if top_crops:
                for crop in top_crops:
                    category = classify_suitability(crop['score'])
                    print(f"  - Crop: {crop['crop_name']:<15} | Score: {crop['score']:.2f}/100 | Class: {category} | Limiting Factor: {crop['limiting_factor']}")
                    
                    missing_env = crop['missing_params_info']['from_environment']
                    missing_crop = crop['missing_params_info']['from_crop_data']
                    if missing_env or missing_crop:
                        notes = []
                        if missing_env: notes.append(f"input data missing for: {', '.join(missing_env)}")
                        if missing_crop: notes.append(f"crop data missing for: {', '.join(missing_crop)}")
                        print(f"    * Note: Calculation excluded some parameters ({'; '.join(notes)}). The score may not be fully representative.")
            else:
                print("  No suitable crops found for these conditions.")

        print("\n" + "="*25 + " Comprehensive Details Example " + "="*25)
        crop_to_find = 'Mango'
        print(f"\nFetching details for '{crop_to_find}' evaluated against Scenario 2 (missing input data)...")
        details = system.get_crop_details(crop_to_find, env_params=env2)

        if 'error' in details:
            print(f"  Error: {details['error']}")
        else:
            print("\n--- Biophysical Suitability Parameters (from dataset) ---")
            for key, value in details.items():
                if key not in ['score', 'limiting_factor', 'missing_params_info']:
                    print(f"  - {key:<15}: {value}")
            
            print("\n--- Calculated Suitability for this Environment ---")
            score = details.get('score', 0)
            limiting = details.get('limiting_factor', 'N/A')
            missing_info = details.get('missing_params_info', {})
            category = classify_suitability(score)
            
            print(f"  - Suitability Score: {score:.2f} / 100")
            print(f"  - Class: {category}")
            print(f"  - Primary Limiting Factor: {limiting}")

            missing_env = missing_info.get("from_environment", [])
            missing_crop = missing_info.get("from_crop_data", [])
            if missing_env or missing_crop:
                print("  - Excluded Parameters:")
                if missing_env: print(f"    - From Your Input: {', '.join(missing_env)}")
                if missing_crop: print(f"    - From Crop's Data: {', '.join(missing_crop)}")
                print("    (Note: These were excluded from the calculation, which may affect the final score.)")

            REMEDIAL_MEASURES = {
                "pH": "Apply lime to increase soil pH or sulfur to decrease it.",
                "Temperature": "Choose appropriate planting season or select heat-tolerant varieties.",
                "Rainfall": "Install irrigation or drainage systems as needed.",
                "Altitude": "Select altitude-suitable varieties or switch crops.",
                "Fertility": "Add organic compost or fertilizers.",
                "Salinity": "Use salt-tolerant crops or apply gypsum.",
                "Drainage": "Improve drainage using raised beds or channels.",
                "Depth": "Use shallow-rooted crop varieties.",
                "Texture": "Add organic matter to improve soil structure.",
            }
            remedial = REMEDIAL_MEASURES.get(limiting, "No specific suggestion available.")
            print(f"  - Suggested Remedial Action: {remedial}")
