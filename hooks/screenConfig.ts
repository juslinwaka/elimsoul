'use client'
import {useTheme} from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'

type ScreenConfig = {
    isXs: boolean;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

export const useScreenConfig = (): ScreenConfig => {
    const theme = useTheme();

    const isXs = 
        useMediaQuery(theme.breakpoints.only('xs'));

    const isSm = 
        useMediaQuery(theme.breakpoints.only('sm'));

    const isMd = 
        useMediaQuery(theme.breakpoints.only('md'));

    const isLg = 
        useMediaQuery(theme.breakpoints.only('lg'));

    const isXl = 
        useMediaQuery(theme.breakpoints.only('xl'));

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return{
        isXs,
        isSm,
        isMd,
        isLg,
        isXl,
        isMobile,
        isTablet,
        isDesktop
    };
};