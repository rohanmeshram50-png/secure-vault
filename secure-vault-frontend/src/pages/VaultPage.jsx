import React, {
  useState,
  useEffect,
  useContext
} from 'react';

import {
  getVault,
  updateVault
} from '../services/vaultService';

import {
  AuthContext
} from '../context/AuthContext';

import {
  encrypt,
  decrypt
} from '../services/cryptoService';

import API from '../services/api';

import {
  TextField,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';

import ContentCopyIcon
from '@mui/icons-material/ContentCopy';

import AddIcon
from '@mui/icons-material/Add';

import SaveIcon
from '@mui/icons-material/Save';

import DeleteIcon
from '@mui/icons-material/Delete';



const VaultPage = () => {

  const [vaultData,setVaultData]
  = useState([]);

  const [decryptedVault,
  setDecryptedVault]
  = useState([
    {
      platform:'',
      username:'',
      password:''
    }
  ]);

  const [error,setError]
  = useState('');

  const { auth }
  = useContext(AuthContext);

  const [tempPassword,
  setTempPassword]
  = useState('');

  const [snackbarOpen,
  setSnackbarOpen]
  = useState(false);

  const [snackbarMessage,
  setSnackbarMessage]
  = useState('');



/* =========================
        MFA STATES
========================= */

  const [mfaDialogOpen,
  setMfaDialogOpen]
  = useState(false);

  const [qrCode,
  setQrCode]
  = useState('');

  const [otp,
  setOtp]
  = useState('');



  const getMasterPassword =
  () =>
  auth.masterPassword ||
  tempPassword;



/* =========================
      FETCH VAULT
========================= */

  useEffect(()=>{

    const fetchAndDecryptVault =
    async()=>{

      try{

        const masterPassword =
        getMasterPassword();

        if(!masterPassword){
          return;
        }

        const { data } =
        await getVault();

        if(data.encryptedBlob){

          try{

            const decrypted =
            decrypt(
              data.encryptedBlob,
              masterPassword
            );

            const parsedData =
            JSON.parse(decrypted);

            setDecryptedVault(
              parsedData
            );

          }catch(e){

            console.error(e);

            setError(
            'Failed to decrypt vault.'
            );

          }

        }else{

          setDecryptedVault([
            {
              platform:'',
              username:'',
              password:''
            }
          ]);

        }

      }catch(err){

        setError(
        'Unexpected error fetching vault'
        );

      }

    };

    if(auth.isAuthenticated){
      fetchAndDecryptVault();
    }

  },[
    auth.isAuthenticated,
    auth.masterPassword,
    tempPassword
  ]);



/* =========================
       UPDATE VAULT
========================= */

  const handleUpdate =
  async()=>{

    try{

      const masterPassword =
      getMasterPassword();

      if(!masterPassword){

        setError(
        'Master password missing'
        );

        return;
      }

      const encryptedBlob =
      encrypt(
        JSON.stringify(
          decryptedVault
        ),
        masterPassword
      );

      await updateVault(
        encryptedBlob
      );

      setSnackbarMessage(
      'Vault updated successfully!'
      );

      setSnackbarOpen(true);

    }catch(err){

      setError(
      'Error updating vault'
      );

    }

  };



/* =========================
       COPY PASSWORD
========================= */

const handleCopyPassword =
(password)=>{

 navigator.clipboard
 .writeText(password)

 .then(()=>{

   setSnackbarMessage(
   'Password copied!'
   );

   setSnackbarOpen(true);

 })

 .catch(()=>{

   setSnackbarMessage(
   'Copy failed'
   );

   setSnackbarOpen(true);

 });

};



/* =========================
       ENABLE MFA
========================= */

const handleEnableMFA =
async()=>{

 try{

   // TEMP HARDCODE
   const userId = 1;

   const response =
   await API.post(
    '/auth/mfa/setup',
    { userId }
   );

   setQrCode(
    response.data.qrCode
   );

   setMfaDialogOpen(true);

 }catch(err){

   console.error(err);

   setSnackbarMessage(
   'Failed to setup MFA'
   );

   setSnackbarOpen(true);

 }

};



/* =========================
       VERIFY OTP
========================= */

const handleVerifyOTP =
async()=>{

 try{

   const userId = 1;

   const response =
   await API.post(
    '/auth/mfa/verify',
    {
      userId,
      token:otp
    }
   );

   setSnackbarMessage(
   response.data.message
   );

   setSnackbarOpen(true);

   setMfaDialogOpen(false);

 }catch(err){

   console.error(err);

   setSnackbarMessage(
   err.response?.data?.error ||
   'OTP verification failed'
   );

   setSnackbarOpen(true);

 }

};



/* =========================
      TABLE FUNCTIONS
========================= */

const handleCellChange =
(index,field,value)=>{

 const newVault =
 [...decryptedVault];

 newVault[index][field]
 = value;

 setDecryptedVault(
 newVault
 );

};


const handleAddRow = ()=>{

 setDecryptedVault([
   ...decryptedVault,
   {
     platform:'',
     username:'',
     password:''
   }
 ]);

};


const handleRemoveRow =
(index)=>{

 const newVault =
 decryptedVault.filter(
 (_,i)=>i!==index
 );

 setDecryptedVault(
 newVault
 );

};



const handleCloseSnackbar =
(event,reason)=>{

 if(reason==='clickaway'){
   return;
 }

 setSnackbarOpen(false);

};



/* =========================
     MASTER PASSWORD
========================= */

if(
 auth.isAuthenticated &&
 !auth.masterPassword &&
 !tempPassword
){

 return(

  <Container maxWidth="xs">

   <Box
    sx={{
      mt:8,
      display:'flex',
      flexDirection:'column',
      alignItems:'center'
    }}
   >

    <Paper
     elevation={3}
     sx={{
      p:4,
      width:'100%'
     }}
    >

     <Typography
      variant="h5"
      gutterBottom
     >
      Session Found
     </Typography>

     <Typography
      sx={{mb:3}}
     >
      Re-enter master password
     </Typography>


     <form
      onSubmit={(e)=>{

       e.preventDefault();

       setTempPassword(
       document.getElementById(
       'temp-password'
       ).value
       );

      }}
     >

      <TextField
       id="temp-password"
       label="Master Password"
       type="password"
       fullWidth
      />

      <Button
       type="submit"
       variant="contained"
       fullWidth
       sx={{mt:2}}
      >
       Unlock Vault
      </Button>

     </form>

    </Paper>

   </Box>

  </Container>

 );

}



/* =========================
          UI
========================= */

return(

<Container maxWidth="lg">

<Box
 sx={{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  mt:4,
  mb:4
 }}
>

<Typography
 variant="h4"
 sx={{
  fontWeight:700
 }}
>
 My Vault
</Typography>


<Box>

<Button
 variant="contained"
 color="secondary"
 startIcon={<AddIcon />}
 onClick={handleAddRow}
 sx={{mr:2}}
>
 Add Item
</Button>


<Button
 variant="contained"
 color="primary"
 startIcon={<SaveIcon />}
 onClick={handleUpdate}
 sx={{mr:2}}
>
 Save Changes
</Button>



<Button
 variant="contained"
 color="success"
 onClick={handleEnableMFA}
>
 Enable MFA
</Button>

</Box>

</Box>



{error &&
<Alert
 severity="error"
 sx={{mb:3}}
>
 {error}
</Alert>
}



<TableContainer
 component={Paper}
>

<Table>

<TableHead>

<TableRow>

<TableCell>
 Platform
</TableCell>

<TableCell>
 Username
</TableCell>

<TableCell>
 Password
</TableCell>

<TableCell>
 Actions
</TableCell>

</TableRow>

</TableHead>



<TableBody>

{
decryptedVault.map(
(row,index)=>(

<TableRow
 key={index}
>

<TableCell>

<TextField
 value={row.platform}
 onChange={(e)=>
 handleCellChange(
 index,
 'platform',
 e.target.value
 )
 }
 fullWidth
 size="small"
/>

</TableCell>



<TableCell>

<TextField
 value={row.username}
 onChange={(e)=>
 handleCellChange(
 index,
 'username',
 e.target.value
 )
 }
 fullWidth
 size="small"
/>

</TableCell>



<TableCell>

<Box
 sx={{
  display:'flex',
  alignItems:'center'
 }}
>

<TextField
 value={row.password}
 onChange={(e)=>
 handleCellChange(
 index,
 'password',
 e.target.value
 )
 }
 type="password"
 fullWidth
 size="small"
/>


<Tooltip title="Copy Password">

<IconButton
 onClick={()=>
 handleCopyPassword(
 row.password
 )
 }
>

<ContentCopyIcon/>

</IconButton>

</Tooltip>

</Box>

</TableCell>



<TableCell>

<IconButton
 color="error"
 onClick={()=>
 handleRemoveRow(index)
 }
>

<DeleteIcon/>

</IconButton>

</TableCell>

</TableRow>

))
}

</TableBody>

</Table>

</TableContainer>



{/* =========================
       MFA POPUP
========================= */}

<Dialog
 open={mfaDialogOpen}
 onClose={()=>
 setMfaDialogOpen(false)
 }
 maxWidth="sm"
 fullWidth
>

<DialogTitle>
 Enable MFA
</DialogTitle>


<DialogContent>

<Typography sx={{mb:2}}>
 Scan QR using Google Authenticator
</Typography>


{qrCode &&

<img
 src={qrCode}
 alt="MFA QR"
 style={{
   width:'250px',
   display:'block',
   margin:'auto'
 }}
/>

}


<TextField
 label="Enter OTP"
 fullWidth
 sx={{mt:3}}
 value={otp}
 onChange={(e)=>
 setOtp(e.target.value)
 }
/>


<Button
 variant="contained"
 fullWidth
 sx={{mt:2}}
 onClick={handleVerifyOTP}
>
 Verify OTP
</Button>

</DialogContent>

</Dialog>



<Snackbar
 open={snackbarOpen}
 autoHideDuration={3000}
 onClose={handleCloseSnackbar}
>

<Alert
 severity="success"
 sx={{width:'100%'}}
>
 {snackbarMessage}
</Alert>

</Snackbar>

</Container>

);

};

export default VaultPage;
