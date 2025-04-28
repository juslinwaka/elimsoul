'use client'
import { useState } from 'react';

import { CircularProgress, Backdrop } from '@mui/material';

export const useLoading = () => {
    const [open, setOpen] = useState(false);

    const showLoading = () => useState(true);
    const hideLoading = () => useState(false);

    const Loading = () => (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}>
                <CircularProgress color='inherit'/>
        </Backdrop>
    );
    return {showLoading, hideLoading, Loading}
}