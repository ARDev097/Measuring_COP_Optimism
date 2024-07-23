import pandas as pd

data = pd.read_csv("../Data_Source/data.csv", encoding='latin1')

# Define the weights 
weights_season3_4 = {
    'th_vp': 40,
    'ch_vp_r2': 45,
    'gc_vp_s3': 15,
    'gc_vp_s4': 15
}

weights_season5 = {
    'th_vp': 39,
    'ch_vp_r3': 40,
    'ch_vp_r2': 38,
    'gc_vp_s5': 6,
    'gc_vp_mm_s5': 3,
    'dab_vp_s5': 3,
    'coc_vp_s5': 4,
    'gc_vp_s4': 6,
    'gc_vp_s3': 6
}

def calculate_mHHI_season3_4(chosen_columns):

    # Multiply each chosen column by its respective weight and sum the results
    data['total_voting_power'] = sum(data[col] * (weights_season3_4[col] / 100) for col in chosen_columns)

    # Calculate the squared total voting power
    data['total_voting_power_squared'] = data['total_voting_power'] ** 2

    # Calculate the mHHI
    mHHI = round(data['total_voting_power_squared'].sum(), 6)
    
    return mHHI

def calculate_mHHI_season5(chosen_columns):

    # Multiply each chosen column by its respective weight and sum the results
    data['total_voting_power'] = sum(data[col] * (weights_season5[col] / 100) for col in chosen_columns)

    # Calculate the squared total voting power
    data['total_voting_power_squared'] = data['total_voting_power'] ** 2

    # Calculate the mHHI
    mHHI = round(data['total_voting_power_squared'].sum(), 6)
    
    return mHHI

# Example usage
round2_season3 = ['th_vp', 'ch_vp_r2', 'gc_vp_s3']
round2_season4 = ['th_vp', 'ch_vp_r2', 'gc_vp_s4']
round2_season5 = ['th_vp', 'ch_vp_r2', 'gc_vp_s5', 'gc_vp_mm_s5', 'dab_vp_s5', 'coc_vp_s5']
round3_season5 = ['th_vp', 'ch_vp_r3', 'gc_vp_s5', 'gc_vp_mm_s5', 'dab_vp_s5', 'coc_vp_s5']

mHHI_round2_season3 = calculate_mHHI_season3_4(round2_season3)
mHHI_round2_season4 = calculate_mHHI_season3_4(round2_season4)
mHHI_round2_season5 = calculate_mHHI_season5(round2_season5)
mHHI_round3_season5 = calculate_mHHI_season5(round3_season5)

print("mHHI for Round 2 and Season 3:", mHHI_round2_season3)
print("mHHI for Round 2 and Season 4:", mHHI_round2_season4)
print("mHHI for Round 2 and Season 5:", mHHI_round2_season5)
print("mHHI for Round 3 and Season 5:", mHHI_round3_season5)