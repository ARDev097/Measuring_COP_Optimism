import pandas as pd

# Read the data from the CSV file
data = pd.read_csv("../Data_Source/data.csv", encoding='latin1')

def calculate_HHI():
    # Calculate HHI for Token House
    data['th_vp_squared'] = data['th_vp'] ** 2
    hhi_th = data['th_vp_squared'].sum()
    print("HHI in Token House :", round(hhi_th, 6))

    # Calculate HHI for Citizen House Round 3
    data['ch_vp_r3_squared'] = data['ch_vp_r3'] ** 2
    hhi_ch_r3 = data['ch_vp_r3_squared'].sum()
    print("HHI in Citizen House Round 3 :", round(hhi_ch_r3, 6))

    # Calculate HHI for Citizen House Round 2
    data['ch_vp_r2_squared'] = data['ch_vp_r2'] ** 2
    hhi_ch_r2 = data['ch_vp_r2_squared'].sum()
    print("HHI in Citizen House Round 2 :", round(hhi_ch_r2, 6))

    # Calculate HHI for Grants Council Season 5
    data['gc_vp_s5_squared'] = data['gc_vp_s5'] ** 2
    hhi_gc_s5 = data['gc_vp_s5_squared'].sum()
    print("HHI in Grants Council Season 5 (without Milestone & Metrics Committee) :", round(hhi_gc_s5, 6))

    # Calculate HHI for Grants Council Season 5 (Milestones & Metrics)
    data['gc_vp_mm_s5_squared'] = data['gc_vp_mm_s5'] ** 2
    hhi_gc_mm_s5 = data['gc_vp_mm_s5_squared'].sum()
    print("HHI in Grants Council Season 5 :", round(hhi_gc_mm_s5, 6))

    # Calculate HHI for Developer Advisory Board
    data['dab_vp_s5_squared'] = data['dab_vp_s5'] ** 2
    hhi_dab = data['dab_vp_s5_squared'].sum()
    print("HHI in Developer Advisory Board Season 5 :", round(hhi_dab, 6))

    # Calculate HHI for Code of Conduct Council
    data['coc_vp_s5_squared'] = data['coc_vp_s5'] ** 2
    hhi_coc = data['coc_vp_s5_squared'].sum()
    print("HHI in Code of Conduct Council Season 5 :", round(hhi_coc, 6))

    # Calculate HHI for Grants Council Season 4
    data['gc_vp_s4_squared'] = data['gc_vp_s4'] ** 2
    hhi_gc_s4 = data['gc_vp_s4_squared'].sum()
    print("HHI in Grants Council Season 4 :", round(hhi_gc_s4, 6))

    # Calculate HHI for Grants Council Season 3
    data['gc_vp_s3_squared'] = data['gc_vp_s3'] ** 2
    hhi_gc_s3 = data['gc_vp_s3_squared'].sum()
    print("HHI in Grants Council Season 3 :", round(hhi_gc_s3, 6))

if __name__ == "__main__":
    calculate_HHI()