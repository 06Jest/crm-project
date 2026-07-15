// import React from 'react';
// import {
//   Box,
//   AppBar,
//   Toolbar,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   Avatar,
//   Divider,
//   Chip,
// } from '@mui/material';
// import {
//   Logout as LogoutIcon,
//   Security as SecurityIcon,
//   Settings as SettingsIcon,
// } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '../store/store';
// import { clearSuperAdmin } from '../store/superAdminSlice';
// import { superAdminLogout } from '../services/superAdminAuthService';

// export default function SuperAdminHeader() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const superAdmin = useSelector((state: RootState) => state.superAdmin.user);

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

//   const handleLogout = async () => {
//     await superAdminLogout();
//     dispatch(clearSuperAdmin());
//     navigate('/admin-auth/login');
//   };

//   return (
//     <AppBar position="fixed" elevation={1} sx={{height: '70px'}}>
//       <Toolbar>
//         <SecurityIcon sx={{ mr: 1 }} />
//         <Typography variant="h6" fontWeight={700} sx={{ mr: 'auto' }}>
//           UniThread Admin Portal
//         </Typography>

//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <Chip
//             label="Tier 3: Super Admin"
//             size="small"
//             variant="outlined"
//             sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
//           />

//           <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} color="inherit">
//             <Avatar
//               sx={{ width: 32, height: 32, background: 'rgba(255,255,255,0.2)' }}
//             >
//               {superAdmin?.name?.charAt(0).toUpperCase()}
//             </Avatar>
//           </IconButton>

//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={() => setAnchorEl(null)}
//           >
//             <MenuItem disabled>
//               <Typography variant="body2" fontWeight={600}>
//                 {superAdmin?.name}
//               </Typography>
//             </MenuItem>
//             <MenuItem disabled>
//               <Typography variant="caption" color="text.secondary">
//                 Tier 3: Super Admin
//               </Typography>
//             </MenuItem>

//             <Divider />

//             <MenuItem onClick={() => navigate('/admin/security-settings')}>
//               <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
//               Security Settings
//             </MenuItem>

//             <MenuItem onClick={handleLogout}>
//               <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
//               Logout
//             </MenuItem>
//           </Menu>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }