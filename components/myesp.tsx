'use client'
import {Grid, 
  Box,
Typography,
Paper,
Button} from '@mui/material'

const MyESP = () => {

    return(
        <Grid container size={12}>
            <Grid size={12} p={2} sx={{ marginTop: '20px' }}>
                <Box sx={{border: 3, borderColor: 'white', borderRadius: '8px'}} justifyItems='center'>
                    <Typography sx={{color: 'white'}} fontWeight={500} variant='h5'>My Soul Points</Typography>
                </Box>

                <Box sx={{border: 2, borderColor: 'white', borderRadius: '8px', padding:2 }}>
                              <Grid container>
                                <Grid size={6}>
                                  <Box sx={{border: 2, borderColor: 'white', backgroundColor: 'gray'}} justifyItems='center'>
                                    <Typography sx={{color: 'white', marginLeft:2}} fontWeight={600} variant='h5'>
                                        Milestone</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 50}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} >Attended Bible Circle</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 50}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300}>Used Summarizer</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 50}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} variant='h5'> - </Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 50}}>
                                    <Typography sx={{color: 'white'}} fontWeight={300} variant='h5'> - </Typography>
                                  </Box>

                                  <Box sx={{border: 2, borderColor: 'white', minHeight: 50 , backgroundColor: 'greenyellow'}} justifyItems='center'>
                                    <Typography sx={{color: 'black'}} fontWeight={600} variant='h5'> Grand Total </Typography>
                                  </Box>
                                </Grid>
                
                                
                                <Grid size={6}>
                                  <Box sx={{border: 2, borderColor: 'white', backgroundColor: 'gray'}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 2}} fontWeight={600} variant='h5'>ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white',minHeight: 50}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={300} variant='h5'>1000 ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white',minHeight: 50}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={300} variant='h5'>810 ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white',minHeight: 50}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={300} variant='h5'>450 ESP</Typography>
                                  </Box>
                                  <Box sx={{border: 2, borderColor: 'white',minHeight: 50}} justifyItems='end'>
                                    <Typography sx={{color: 'white', marginRight: 3}} fontWeight={300} variant='h5'>100 ESP</Typography>
                                  </Box>

                                  <Box sx={{border: 2, borderColor: 'white',minHeight: 50, backgroundColor: 'greenyellow'}} justifyItems='end'>
                                    <Typography sx={{color: 'black', marginRight: 3}} fontWeight={300} variant='h5'>2,200 ESP</Typography>
                                  </Box>
                
                                </Grid>

                                <Grid size={12}>
                                    <Button color='success' 
                                        fullWidth variant='contained'
                                        sx={{marginTop: 1, borderRadius: 10}}>Redeem ESP</Button>
                                </Grid>
                              </Grid>
                            </Box>
            </Grid>
        </Grid>
    )
}

export default MyESP;