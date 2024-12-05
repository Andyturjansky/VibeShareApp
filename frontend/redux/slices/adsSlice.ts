import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdImagePath {
  portraite: string;
  landscape: string;
}

export interface Ad {
  commerce: string;
  date: {
    start: number;
    end: number;
  };
  imagePath: AdImagePath[];
  Url: string;
}

interface AdsState {
  ads: Ad[];
  loading: boolean;
  error: string | null;
}

const initialState: AdsState = {
  ads: [],
  loading: false,
  error: null,
};

const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setAds: (state, action: PayloadAction<Ad[]>) => {
      state.ads = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAds, setLoading, setError } = adsSlice.actions;
export default adsSlice.reducer;