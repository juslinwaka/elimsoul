'use client'
import {Grid, 
  Box,
Typography,
Paper} from '@mui/material'

const Leaderboard = () => {

    return(
        <Grid container size={12}>
            <Grid size={12} p={2} sx={{ marginTop: '20px' }}>
                <Box sx={{border: 3, borderColor: 'white', borderRadius: '8px'}} justifyItems='center'>
                    <Typography sx={{color: 'white'}} fontWeight={500} variant='h5'>Leaderboard</Typography>
                </Box>

                <Box sx={{border: 2, borderColor: 'white', borderRadius: '8px', padding:2 }}>
                              <Grid container>
                                <Grid size={6}>
                                  <Box sx={{border: 2, borderColor: 'white', backgroundColor: 'gray'}} justifyItems='center'>
                                    <Typography sx={{color: 'white', marginLeft:2}} fontWeight={600} variant='h5'>
                                        Names</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} variant='h5'>John Devi</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} variant='h5'>Sarah Amani</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} variant='h5'>Michael Jumbe</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} variant='h5'>Judith Mwenda</Typography>
                                  </Box>
                                </Grid>
                
                                
                                <Grid size={6}>
                                  <Box sx={{border: 2, borderColor: 'white', backgroundColor: 'gray'}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 2}} fontWeight={600} variant='h5'>Soul Points</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={400} variant='h5'>4000 ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={400} variant='h5'>810 ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={400} variant='h5'>450 ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 20}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={400} variant='h5'>100 ESP</Typography>
                                  </Box>
                
                                </Grid>
                              </Grid>
                            </Box>
            </Grid>
        </Grid>
    )
}

export default Leaderboard;