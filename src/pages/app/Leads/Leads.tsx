// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import type { AppDispatch, RootState } from "../../../store/store";
// // import { useAuthContext } from '../../../hooks/useAuthContext'

// import {
//   updateLead,
//   deleteLead, 
//   moveLeadLocally,
//   updateLeadStatus,
//   clearError,
//   fetchLeadsLists,
// } from '../../../store/leadsSlice';
// import { LEAD_STATUSES, type Lead, type LeadStatus, type UpdateLead } from '../../../types/lead';

// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   type DropResult,
// } from '@hello-pangea/dnd';

// import {
//   Box,
//   Typography,
//   Button,
//   Snackbar,
//   Card,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   MenuItem,
//   CircularProgress,
//   IconButton,
//   Chip,
//   Popover,
//   InputAdornment,
//   Divider,
//   Autocomplete,
// } from '@mui/material';
// import InfoIcon from '@mui/icons-material/Info';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import CloseIcon from '@mui/icons-material/Close';
// import EmailIcon from '@mui/icons-material/Email';
// import CallIcon from '@mui/icons-material/Call';
// import SmsIcon from '@mui/icons-material/Sms';
// import PersonIcon from '@mui/icons-material/Person';
// import SearchIcon from '@mui/icons-material/Search';
// import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
// import AddIcon from '@mui/icons-material/Add';
// import FolderSharedIcon from "@mui/icons-material/FolderShared";
// // import { useAuth } from "../../../hooks/useAuth";
// import ErrorAlert from "../../../components/Error";
// import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender, type PreferredTime, type Priority, type Source, type Suffix } from "../../../types/global";
// import { formatName, formatShortTitle } from "../../../utils/formatText";
// import { calculateAge } from "../../../utils/calculateAge";

// const PRIORITY_COLORS: Record<Priority, string> = {
//   Highest: '#df3232',
//   High: '#cc9e1fd0',
//   Low: '#ffffff00',
// }

// export default function Leads() {
//   const themeMode = useSelector((state: RootState) => state.ui.themeMode);
//   const {items: leads, loading, loaded,  error } = useSelector((state: RootState) => state.leads);
//   const dispatch = useDispatch<AppDispatch>();
//   // const { user } = useAuth();
//   const [isEditing, setIsEditing] = useState(false);
//   const [edit, setEdit] = useState(false);
  
//   const [dropResult, setDropResult] = useState<DropResult | null>(null)
//   const [openDelete, setOpenDelete] = useState(false);
//   const [invalid, setInvalid] = useState('');
//   const [openAddContact, setOpenAddContact] = useState(false);
//   const [openInvalid, setOpenInvalid] = useState(false);
//   const [openEditConfirmation, setOpenEditConfirmation] = useState(false);
//   const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
//   const [editingLead, setEditingLead] = useState<UpdateLead | null>();
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
//   const [hoveredLead, setHoveredLead] = useState<Lead | null>(null);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
  
//   const [search, setSearch] = useState<Record<LeadStatus, string>>({
//     New: '',
//     Contacted: '',
//     Qualified: '',
//     Closed: '',
//   });
//   const [form, setForm] = useState<UpdateLead>({
//     id: "",
//     title: "",
//     first_name: "",
//     last_name: "",
//     suffix: null as Suffix,
//     email: null,
//     phone: null,
//     gender: "Prefer not to say" as Gender,
//     birth_date: null,
//     industry: "",
//     company_name: "",
//     department: "",
//     position: "",
//     website: "",
//     source: "Other" as Source,
//     priority: "Low" as Priority,
//     notes: "",
//     facebook: "",
//     x: "",
//     whatsapp: "",
//     linkedin: "",
//     instagram: "",
//     telegram: "",
//     tiktok: "",
//     viber: "",
//     preferred_contact_time: "Anytime" as PreferredTime,
//   });



  
  
//   useEffect(() => {
//     if (loading) return;

//     const loadData = async () => {
//       try {

//         if (!loaded) {
//           await dispatch(fetchLeadsLists()).unwrap();
//         }
//       } catch {
//         // Error handled by Redux state
//       }
//     };
//     loadData();
//   }, [
//     loading,
//     loaded,
//     dispatch,
//   ]);

//   const handleOpenDelete = (lead: Lead) => {
//     setSelectedLead(lead); 
//     setOpenDelete(true);
//     };
//   const handleCloseDelete = () => {
//     setOpenDelete(false);
//   }
//   const handleOpenEditConfirmation = () => {
//     setOpenEditConfirmation(true);
//   }
//   const handleCloseEditConfirmation = () => {
//     setOpenEditConfirmation(false);
//   } 
//   const handleOpenAddContact = (result: DropResult) => {
//     setOpenAddContact(true);
//     if (!result.destination) return;

//     const leadId = result.draggableId;
//     const newStatus = result.destination.droppableId as LeadStatus;
//     const oldStatus = result.source.droppableId as LeadStatus;

//     const lead = leads.find((l) => l.id === leadId);
//     if (!lead) return;

//     if (newStatus === oldStatus) return;
//   }

//   const handleCloseAddContact = (result: DropResult) => {
//     const leadId = result.draggableId;
//     const oldStatus = result.source.droppableId as LeadStatus;

//     const newStatus = oldStatus;

//     const lead = leads.find((l) => l.id === leadId);
//     if (!lead) return;

//     dispatch(moveLeadLocally({id: leadId, newStatus}));
//     setOpenAddContact(false);
//   };

//   const handleCloseInvalid = () => {
//     setOpenInvalid(false);
//   };

//   const handleDelete = async (id: string) => {
//     await dispatch(deleteLead(id)).unwrap();
//   };

//   const handleOpenEdit = (lead: UpdateLead) => {
//     setForm({
//       id: lead.id,
//       title: lead.title,
//       first_name: lead.first_name,
//       last_name: lead.last_name,
//       suffix: lead.suffix as Suffix || null ,
//       gender: lead.gender as Gender,
//       birth_date: lead.birth_date || null ,
//       email: lead.email || null || '',
//       phone: lead.phone || null || '',
//       industry: lead.industry || '',
//       company_name: lead.company_name || '',
//       position: lead.position || '',
//       department: lead.department || '',
//       website: lead.website || '',
//       source: lead.source as Source,
//       priority: lead.priority as Priority,
//       notes: lead.notes || '',
//       preferred_contact_time: lead.preferred_contact_time as PreferredTime,
//       facebook: lead.facebook || '',
//       x: lead.x || '',
//       whatsapp: lead.whatsapp || '',
//       linkedin: lead.linkedin || '',
//       instagram: lead.instagram || '',
//       telegram: lead.telegram || '',
//       tiktok: lead.tiktok || '',
//       viber: lead.viber || '',
//     });
//     setEditingLead(lead);
//     setIsEditing(true);
//     setEdit(false);
//   };

//   const handleCloseEdit = () => {
//     dispatch(clearError());
//     setEdit(false);
//     setIsEditing(false);
//     setOpenEditConfirmation(false);
//   } 

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleEditable = () => {
//     setEdit(true);
//   }
//   const handleNotEditable = () => {
//     setEdit(false);
//   }
//   const handleEdit = async () => {
//     if (loading) return;

//     try {
//       setEdit(false);
    
//       if (!editingLead) return;

//       const leadId = editingLead.id;
//       await dispatch(updateLead({ id: leadId, lead: form as Lead })).unwrap();
//       setIsEditing(false);
//     } catch {
//       setIsEditing(true);
//       setEdit(true);
//       if (!editingLead) return;
//     }
    
//   };

//   const handleMouseEnter = (
//     event: React.MouseEvent<HTMLDivElement>,
//     lead: Lead
//   ) => {
//     setAnchorEl(event.currentTarget);
//     setHoveredLead(lead);
//   };

//   const handleMouseLeave = () => {
//     setAnchorEl(null);
//     setHoveredLead(null);
//   };

//   const handleAddContact = async (result: DropResult) => {

//     if (!result.destination) return;

//     const leadId = result.draggableId;
//     const newStatus = result.destination.droppableId as LeadStatus;
//     const oldStatus = result.source.droppableId as LeadStatus;

//     const lead = leads.find((l) => l.id === leadId);
//     if (!lead) return;

//     if (newStatus === oldStatus) return;


//     if (!lead.email?.trim() && !lead.phone?.trim()) {
//       setOpenInvalid(true);
//       handleCloseAddContact(result);
//       return;
//     }

//     await dispatch(updateLeadStatus({ id: leadId, status: newStatus })).unwrap();
    
//     navigate('/app/contacts');
//   }

//   const handleDragEnd = async (result: DropResult) => {
//     setDropResult(result);

//     if (!result.destination) return;

//     const leadId = result.draggableId;
//     const newStatus = result.destination.droppableId as LeadStatus;
//     const oldStatus = result.source.droppableId as LeadStatus;

//     if (newStatus === oldStatus) return;

//     const lead = leads.find((l) => l.id === leadId);
//     if (!lead) return;

//     if (
//       oldStatus === 'Qualified' &&
//       ['New', 'Contacted', 'Closed'].includes(newStatus)
//     ) {
//       const message =
//         newStatus === 'Closed'
//           ? `This lead is already in Contacts. Unable to change the status to '${newStatus}'. Please change the status in Contacts instead.`
//           : `This lead is already in Contacts. Unable to change the status back to '${newStatus}'.`;

//       setInvalid(message);
//       setTimeout(() => setInvalid(''), 3000);
//       return;
//     }

//     if (oldStatus === 'Closed' && 
//       ['New', 'Contacted', 'Qualified'].includes(newStatus)) {
//       setInvalid(
//         `This lead already exists. Unable to change the status back to '${newStatus}'.`
//       );
//       setTimeout(() => setInvalid(''), 3000);
//       return;
//     }

//     dispatch(moveLeadLocally({ id: leadId, newStatus }));

//     if (newStatus === 'Qualified') {
//       handleOpenAddContact(result);
//     } else {
//       await dispatch(updateLeadStatus({ id: leadId, status: newStatus })).unwrap();
//     }
//   };
  

//   const getLeadsByStatus = (status: LeadStatus) => {
//     const query = search[status].toLowerCase().trim();

//     return leads
//       .filter((lead) => lead.status === status)
//       .filter((lead) => {
//         if (!query) return true;

//         const searchableText = [
//           lead.first_name,
//           lead.last_name,
//           lead.suffix,
//           lead.email,
//           lead.phone,
//           lead.title,
//           lead.notes
//         ]
//           .join(' ')
//           .toLowerCase();

//         return searchableText.includes(query);
//       });
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, height: 1200 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

  

//   return (
//     <Box sx={{height: 1000}}>
//       <Box sx={{
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         justifySelf: 'center', 
//         width: '80vw',
//         maxWidth: 1400, 
//         overflowY: 'auto' }}>
//         <Typography sx={{alignSelf: 'end'}} marginLeft={2} variant="h5" fontWeight={700}>
//           Leads
//         </Typography>
//         <Box>
//           {(error  || invalid) &&  (
//             <ErrorAlert
//               message={(error  || invalid) ?? "An unknown error occurred."}
//             />
//           )}
//         </Box>
        
//         <IconButton
//           title="Add Lead"
//           onClick={() => navigate(`/app/addlead`)}
//           sx={{
//           fontSize: 12,
//           px: 2,
//           pl: 1,  
//           mr: 2,
//           border: '1px solid #bbbbbb88',
//           borderRadius: 2,
//           fontWeight: 700
//         }}>
//           <AddIcon sx={{fontSize: '14px', fontWeight: 700, marginRight: "-3px"}}/>
//           <FolderSharedIcon/>
//         </IconButton>
//       </Box>
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Box sx={{display: 'flex', gap: 1, pb: 2, overflow: 'auto', width: '80vw', maxWidth: 1400, mb: 2,  p: '10px', borderRadius: 2, justifySelf: 'center' }}>
//           {LEAD_STATUSES.map((column) =>(
//             <Box
//               key={column}
//               sx={{ width: '100%' ,minWidth: 260, flex: 1}}
//             >
//               <Box
//                 sx={(theme) => ({
//                   px: 2,
//                   py: 1,
//                   borderRadius: '3px 3px 0 0 ',
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',

//                   bgcolor: theme.palette.mode === 'dark'
//                     ? '#3a3a3a'
//                     : '#d6d4d4d3',
//                 })}
//                 > <Typography fontWeight={600} variant="h6">{column}</Typography>
//                 <TextField 
//                   size="small"
                  
//                   value={search[column]}
//                   onChange={(e) =>
//                     setSearch((prev) => ({
//                       ...prev,
//                       [column]: e.target.value,
//                     }))
//                   }
//                   slotProps={{
//                     input: {
//                       endAdornment: (
//                         <InputAdornment sx={{paddingRight: '1px'}} position="end">
//                           <SearchIcon sx={{backgroundColor: '#c7c7c785', borderRadius: 10, p: 0.3, color: '#383838'}} fontSize="small" />
//                         </InputAdornment>
//                       ),
//                     },
//                   }}
//                   sx={{
//                     border: '1px solid #eeeeee8f',
//                     borderRadius: 5,
//                     backgroundColor: '#FFFFFF',
//                     mx: 2,
//                     color: '#383838',
//                     '& .MuiOutlinedInput-notchedOutline': {
//                       border: 'none',
//                     },
//                     '& .MuiOutlinedInput-root': {
//                       paddingRight: '4px !important',
//                     },
//                     '& .MuiInputBase-input': {
//                       py: '2px',
//                       paddingLeft: '15px',
//                       paddingRight: 0,
//                       color: 'black'
//                     },
//                   }}>
//                     <SearchIcon/>
//                 </TextField>
//                 <Chip
//                   label={getLeadsByStatus(column).length}
//                   size="small"
//                   />
//               </Box>
//               <Droppable droppableId={column}>
//                 {(provided, snapshot) => (
//                   <Box
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     sx={{
//                       minHeight: 500,
//                       bgcolor: snapshot.isDraggingOver
//                         ? 'action.hover'
//                         : 'background.paper',
//                       overflowY: 'auto',
//                       borderRadius: '0 0 8px 8px',
//                       p: 1,
//                       transition: 'background-color 0.2s ease',
//                       height: 850,
//                     }}
//                   >
//                     {getLeadsByStatus(column).map((lead, index) => (
//                       <Draggable
//                         key={lead.id}
//                         draggableId={lead.id}
//                         index={index}
//                       >
//                         {(provided, snapshot) => (
//                           <Card
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             sx={{
//                               mb: 1,
//                               boxShadow: snapshot.isDragging ? 6 : 1,
//                               cursor: 'grab',
//                               opacity: snapshot.isDragging ? 0.85 : 1,
//                               transition: 'box-shadow 0.2s ease',
//                             }}
//                           >
//                             <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, display: 'flex' }}>
//                               <Box sx={{ width: 60}}>
//                                 <Box 
//                                   onMouseEnter={(e) => handleMouseEnter(e, lead)}
//                                   onMouseLeave={handleMouseLeave}
//                                   sx={{
//                                     width: 40, 
//                                     height: 40, 
//                                     mt: 1, 
//                                     mr: 2, 
//                                     cursor: 'pointer',
//                                     border: '1px solid #a3a3a3', 
//                                     borderRadius: 100}}>
//                                   <PersonIcon sx={{width: '100%', height: '90%', opacity: 0.7}}/>
//                                 </Box>
//                               </Box>
//                               <Box flex={'1'}>
//                                 <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
//                                   <Typography
//                                   title="Lead Title"
//                                   sx={{cursor: 'pointer', fontSize: '16px'}}
//                                    fontWeight={600} >
//                                   {formatShortTitle(lead.title).toUpperCase()}
//                                   </Typography>
//                                   <Box
//                                     title={`${lead.priority} Priority`}
//                                    sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
//                                     {lead.priority === 'High' ? (
//                                     <PriorityIcon 
//                                     sx={{
//                                       fontSize: '15px',
//                                       mr: 1, 
//                                       color: PRIORITY_COLORS['High'],
//                                       border: `1px solid ${PRIORITY_COLORS['High']}`,
//                                       borderRadius: 20,
//                                     }}/>
//                                   ) : lead.priority === 'Highest' ? (
//                                     <PriorityIcon sx={{
//                                       fontSize: '15px',
//                                       mr: 1, 
//                                       color: PRIORITY_COLORS['Highest'],
//                                       border: `1px solid ${PRIORITY_COLORS['Highest']}`,
//                                       borderRadius: 20,
//                                     }} />
//                                   ) : null}
//                                      <IconButton
//                                       size="small"
//                                       onClick={() => handleOpenEdit(lead)}
//                                     >
//                                       <InfoIcon titleAccess="Full details" fontSize="small" />
//                                     </IconButton>
//                                   </Box>
                                  
//                                 </Box>
//                                 <Box
//                                   title="Lead full name"
//                                   sx={{ display: 'flex', cursor: 'pointer'}}>
//                                     <Typography sx={{fontSize: '11px', fontWeight: 700}}>
//                                     {formatName(lead.first_name, lead.last_name)} {lead.suffix} 
//                                   </Typography>
//                                 </Box>
//                                 {lead.notes && (
//                                   <Typography
//                                     title="Lead Notes"
//                                     variant="caption"
//                                     color="text.secondary"
//                                     display="block"
//                                     sx={{
//                                       mt: 0.3,
//                                       width: '100%',
//                                       wordBreak: 'break-word',
//                                       cursor: 'pointer'
//                                     }}
//                                   >
//                                     {lead.notes.length > 100
//                                     ? `${lead.notes.slice(0, 100)}...`
//                                     : lead.notes}
//                                   </Typography>
//                                 )}
//                                 <Box sx={{
//                                   display: 'flex', 
//                                   alignItems: 'center',
//                                   mt: '3px' 
//                                   }}>
//                                   <Typography 
//                                   title="Deal Owner"
//                                   color="text.secondary"
//                                   sx={{ px: '5px', py: '1px', 
//                                     border: `1px solid`,
//                                     borderColor: 'primary.main',
//                                     color: 'primary.main',
//                                     borderRadius: 8,
//                                     fontSize: '9px',
//                                     cursor: 'pointer',
//                                     mr: 1
//                                     }}
//                                   >{formatName(lead.owner.first_name, lead.owner.last_name)}</Typography>
//                                   <Typography 
//                                     title="Preferred Time to contact"
//                                     color="text.secondary"
//                                     sx={{ px: '5px', py: '1px', 
//                                       border: '1px solid #291b1b94',
//                                       backgroundColor: '#cccccc00',
//                                       borderRadius: 8,
//                                       fontSize: '9px',
//                                       cursor: 'pointer'
//                                     }}
//                                   >{lead.preferred_contact_time}</Typography>
//                                 </Box>
//                                 <Box sx={{
//                                   display: 'flex',
//                                   justifyContent: 'space-between',
//                                 }}>
//                                   <Box sx={{
//                                     display: 'flex',
//                                     gap: 1,
                                    
//                                     '& .MuiButton-root': {
//                                       minWidth: 30,
//                                       padding: '1px 2px',
//                                       fontSize: '0.75rem',
//                                     }
//                                   }}>
//                                     <IconButton>
//                                       <EmailIcon
//                                         titleAccess="Email lead"
//                                         fontSize="small"
//                                         onClick={() => setOpenSnackbar(true)}
//                                         sx={{cursor: 'pointer', color: 'primary.main'}}
//                                       />
//                                     </IconButton>
//                                     <IconButton>
//                                       <CallIcon
//                                         onClick={() => setOpenSnackbar(true)}
//                                         titleAccess="Call lead"
//                                         fontSize="small"
//                                         sx={{cursor: 'pointer', color: 'primary.main'}}
//                                       />
//                                     </IconButton>
//                                     <IconButton>
//                                       <SmsIcon
//                                         onClick={() => setOpenSnackbar(true)}
//                                         titleAccess="Message lead"
//                                         fontSize="small"
//                                         sx={{cursor: 'pointer', color: 'primary.main'}}
//                                       />
//                                     </IconButton>
//                                   </Box>
//                                   <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                                     <IconButton
//                                       size="small"
//                                       color="error"
//                                       onClick={() => handleOpenDelete(lead)}
//                                     >
//                                       <DeleteIcon titleAccess="Delete lead" fontSize="small" />
//                                     </IconButton>
//                                   </Box>
//                                 </Box> 
//                               </Box>
                              
                              
//                             </CardContent>
//                           </Card>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </Box>
//                 )}
//               </Droppable>
//             </Box>
//           ))}
//         </Box>
//       </DragDropContext>
//       <Dialog PaperProps={{sx: {position: "absolute", backgroundColor: themeMode === 'dark' ? '#30303065' : '#ffffffa9'}}} open={openDelete} onClose={handleCloseDelete}>
//         <DialogTitle sx={{fontWeight: 700}}>
//           CONFIRMATION
//         </DialogTitle>

//         <DialogContent
//           sx = {{
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//             mt: 1,
//             maxwidth: 600,
            
//           }}
//           >
//             Are you sure you want to delete this lead: <b>{selectedLead?.first_name} {selectedLead?.last_name} {selectedLead?.suffix}?</b>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDelete}>
//               Cancel
//             </Button>
//             <Button 
//               variant="contained"
//               color="error"
//               onClick={() => {
//                 if (selectedLead) {
//                   handleDelete(selectedLead.id);
//                 }
//                 handleCloseDelete();
//               }}
//               >
//                 Yes
//               </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog  sx={{position: "absolute", maxHeight: 800, top: 100 }} maxWidth="md" open={isEditing} onClose={handleCloseEdit}>
          
//           <DialogActions sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             '& .MuiButton-root': {
//               fontSize: '0.75rem',
//               padding: '2px 3px',
//               minWidth: 30,
//             },
//           }}>
//             <Button size="small" sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: 2}}>  
//               <EditIcon 
//               onClick={handleEditable}
//               titleAccess="Edit" 
//               sx={{ fontSize: 16, my: '1px' }}  />
//             </Button>
//             <Button size="small" >
//               <CloseIcon 
//               color="error"
//               onClick={handleCloseEdit}
//               titleAccess="Close" 
//               sx={{ 
//                 backgroundColor: '#e45353',
//                 color: 'white', 
//                 borderRadius: 1, }}    />
//             </Button>
//           </DialogActions>
//           <Box sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             justifyContent: 'center',
//             p: 2,
//             mx: 5,
//             mb: 1,
//           }}>
//           <DialogContent
//             sx = {{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               mt: 1,
//               width: {
//                 xs: 250,
//                 sm: 300,
//                 md: 400,
//                 lg: 500
//               },
//             }}>
//             <Box sx={{
//               display: "flex",
//               width: '100%',
//               flexDirection: 'column',
//               overflow: 'auto',
//               justifyContent: "center",
//               gap: 1,
              
//               '& .MuiTextField-root': {
//                   userSelect: edit === true ? 'auto' : 'none',
//                 },
//             }}>
//               {isEditing && error && (
//                 <ErrorAlert
//                   message={error}
//                 />
//               )}
//               <Typography variant="h6" fontWeight={700}>
//               Personal Details
//               </Typography>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
                
//               }}>
//                 <TextField
//                   disabled={!edit}
//                   label="First Name"
//                   name="first_name"
//                   required
//                   value={!edit && !form.first_name ? 'Not provided' : form.first_name}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                   slotProps={{
//                     inputLabel: {
//                       shrink: true,
//                     },
//                   }}
//                 />

//                 <TextField
//                   disabled={!edit}
//                   label="Last Name"
//                   name="last_name"
//                   value={!edit && !form.last_name ? 'Not provided' : form.last_name}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     fontSize: 13,
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                   slotProps={{
//                     inputLabel: {
//                       shrink: true,
//                     },
//                   }}
//                 />
//               </Box>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   select
//                   disabled={!edit}
//                   label="Suffix"
//                   name="suffix"
//                   onChange={handleChange}
//                   value={!edit && !form.suffix ? 'None' : form.suffix}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                   slotProps={{
//                     inputLabel: {
//                       shrink: true,
//                     },
//                     select: {
//                       MenuProps: {
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 250,
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 >
//                 {SUFFIXES.map((suffix) => (
//                     <MenuItem key={suffix} value={suffix}>
//                       {suffix}
//                     </MenuItem>
//                   ))}
//                 </TextField>

//                 <TextField
//                   disabled={!edit}
//                   type="tel"
//                   label="Phone"
//                   name="phone"
//                   value={!edit && !form.phone ? 'Not provided' : form.phone}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                   slotProps={{
//                     inputLabel: {
//                       shrink: true,
//                     },
//                   }}
//                 />
//               </Box>
              
//               <TextField
//                 disabled={!edit}
//                 label="Email"
//                 name="email"
//                 value={!edit && !form.email ? 'Not provided' : form.email}
//                 onChange={handleChange}
//                 size="small"
//                 sx={{
//                   '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                 }}
//                 slotProps={{
//                   inputLabel: {
//                     shrink: true,
//                   },
//                 }}
//               />
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   select
//                   disabled={!edit}
//                   label="Gender"
//                   name="gender"   
//                   onChange={handleChange}
//                   value={form.gender }
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                   slotProps={{
//                     inputLabel: {
//                       shrink: true,
//                     },
//                   }}
//                 >
//                 {GENDERS.map((gender) => (
//                   <MenuItem key={gender} value={gender}>
//                     {gender}
//                   </MenuItem>
//                 ))}
//                 </TextField>
//                 <TextField
//                   disabled={!edit}
//                   label="Date of Birth"
//                   name="birth_date"
//                   type="date"
//                   value={form.birth_date}
//                   onChange={handleChange}
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& input' : {
//                       colorScheme: themeMode === 'dark' ? 'dark' : 'light', 
//                     },
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               </Box>
//               <Typography variant="h6" fontWeight={700} mt={2}>
//                 Professional Details
//               </Typography>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <Autocomplete
//                   freeSolo
//                   disabled={!edit}
//                   sx={{ width: '50%',
//                     '& .MuiOutlinedInput-root': {
//                       height: 28 
//                     },
//                     }}
//                   options={DEPARTMENTS}
//                   value={!edit && !form.department ? 'Not provided' : form.department}
//                   onChange={(_, value) => {
//                     setForm(prev => ({
//                       ...prev,
//                       department: value ?? '',
//                     }));
//                   }}
//                   onInputChange={(_, value) => {
//                     setForm(prev => ({
//                       ...prev,
//                       department: value,
//                     }));
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       slotProps={{ inputLabel: { shrink: true } }}
//                       label="Department"
//                       size="small"
//                         sx={{
//                         '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                       }}
//                     />
//                   )}
//                 />
//                 <Autocomplete
//                   freeSolo
//                   disabled={!edit}
//                   sx={{
//                     width: '50%',
//                     '& .MuiOutlinedInput-root': {
//                       height: 28 
//                     },
//                   }}
//                   options={INDUSTRIES}
//                   value={!edit && !form.industry ? 'Not provided' : form.industry}
//                   onChange={(_, value) => {
//                     setForm(prev => ({
//                       ...prev,
//                       industry: value ?? '',
//                     }));
//                   }}
//                   onInputChange={(_, value) => {
//                     setForm(prev => ({
//                       ...prev,
//                       industry: value,
//                     }));
//                   }}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       slotProps={{ inputLabel: { shrink: true } }}
//                       label="Industry"
//                       size="small"
//                       sx={{
//                         '& .MuiInputBase-input': {
//                       fontSize: 14
//                         }
//                       }}
//                     />
//                   )}
//                 />
//               </Box>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
                
//                 <TextField
//                   disabled={!edit}
//                   label="Company"
//                   name="company_name"
//                   value={!edit && !form.company_name ? 'Not provided' : form.company_name}
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                         py: '3px',
//                         fontSize: 14
//                       },
//                   }}
//               />
//                 <TextField
//                   disabled={!edit}
//                   label="Position"
//                   name="position"
//                   value={!edit && !form.position ? 'Not provided' : form.position}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               </Box>
//               <TextField
//                   disabled={!edit}
//                   label="Website Url"
//                   name="website"
//                   value={!edit && !form.website ? 'Not provided' : form.website}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '100%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               <Typography variant="h6" fontWeight={700} mt={2}>
//                 Social and Messaging Accounts
//               </Typography>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   disabled={!edit}
//                   label="Facebook"
//                   name="facebook"
//                   value={!edit && !form.facebook ? 'Not provided' : form.facebook}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//                 <TextField
//                   disabled={!edit}
//                   label="X/ Twitter"
//                   name="x"
//                   value={!edit && !form.x ? 'Not provided' : form.x}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               </Box>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   disabled={!edit}
//                   label="Instagram"
//                   name="instagram"
//                   value={!edit && !form.instagram ? 'Not provided' : form.instagram}
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                         py: '3px',
//                         fontSize: 14,
//                       },
//                   }}
//               />
//                 <TextField
//                   disabled={!edit}
//                   label="Whatsapp"
//                   name="whatsapp"
//                   value={!edit && !form.whatsapp ? 'Not provided' : form.whatsapp}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               </Box>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   disabled={!edit}
//                   label="Tiktok"
//                   name="tiktok"
//                   value={!edit && !form.tiktok ? 'Not provided' : form.tiktok}
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                         py: '3px',
//                         fontSize: 14
//                       },
//                   }}
//               />
//                 <TextField
//                   disabled={!edit}
//                   label="Telegram"
//                   name="telegram"
//                   value={!edit && !form.telegram ? 'Not provided' : form.telegram}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               </Box>
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   disabled={!edit}
//                   label="Linkedin"
//                   name="linkedin"
//                   value={!edit && !form.linkedin ? 'Not provided' : form.linkedin}
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                         py: '3px',
//                         fontSize: 14
//                       },
//                   }}
//               />
//                 <TextField
//                   disabled={!edit}
//                   label="Viber"
//                   name="viber"
//                   value={!edit && !form.viber ? 'Not provided' : form.viber}
//                   onChange={handleChange}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               </Box>
//               <Typography variant="h6" fontWeight={700} mt={2}>
//                 Additional Details
//               </Typography>
//               <TextField
//                 disabled={!edit}
//                   label="Title"
//                   value={form.title}
//                   name="title"
//                   required
//                   onChange={handleChange}
//                   size="small"
//                   fullWidth
//                   rows={3}
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 />
//               <Box sx={{
//                 display: "flex",
//                 width: '100%',
//                 justifyContent: "space-between",
//                 gap: 1,
//               }}>
//                 <TextField
//                   select
//                   disabled={!edit}
//                   label="Source"
//                   name="source"
//                   value={form.source}
//                   onChange={handleChange}
//                   size="small"
//                   sx={{
//                     width: '50%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
                      
//                       fontSize: 14
//                     },
//                   }}
//                   slotProps={{
//                     inputLabel: { shrink: true },
//                     select: {
//                       MenuProps: {
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 250,
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 >
//                   {SOURCES.map((source) => (
//                     <MenuItem key={source} value={source}>
//                       {source}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <TextField
//                   select
//                   disabled={!edit}
//                   label="Preferred Time"
//                   name="preferred_contact_time"
//                   onChange={handleChange}
//                   value={form.preferred_contact_time}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '25%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 >
//                   {PREFERRED_CONTACT_TIMES.map((time) => (
//                     <MenuItem key={time} value={time}>
//                       {time}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//                 <TextField
//                   select
//                   disabled={!edit}
//                   label="Priority"
//                   name="priority"
//                   onChange={handleChange}
//                   value={form.priority}
//                   size="small"
//                   slotProps={{ inputLabel: { shrink: true } }}
//                   sx={{
//                     width: '25%',
//                     '& .MuiInputBase-input': {
//                       py: '3px',
//                       fontSize: 14
//                     },
//                   }}
//                 >
//                   {PRIORITIES.map((prio) => (
//                     <MenuItem key={prio} value={prio}>
//                       {prio}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//               <TextField
//                 label="Notes"
//                 name="notes"
//                 required
//                 disabled={!edit}
//                 value={form.notes}
//                 onChange={handleChange}
//                 size="small"
//                 multiline
//                 rows={3}
//                 slotProps={{ inputLabel: { shrink: true } }}
//                 sx={{
//                   '& .MuiInputBase-input': {
//                     py: '3px',
//                     fontSize: 14
//                   },
//                 }}
//               />    
//           </Box > 
//           </DialogContent>
//           <DialogActions sx={{ display: edit === true ? 'flex' : 'none'}}>
//             <Button onClick={handleNotEditable}>
//               Cancel
//             </Button>
//             <Button 
//               variant="contained"
//               onClick={() => {
//                 handleOpenEditConfirmation();
//               }}
//               >
//               Submit
//             </Button>
//           </DialogActions>
//           </Box>
//         </Dialog>
//         <Dialog sx={{position: "absolute"}} open={openAddContact} onClose={handleCloseAddContact}>
//           <DialogTitle sx={{fontWeight: 700}}>
//             CONFIRMATION
//           </DialogTitle>  

//           <DialogContent
//             sx = {{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               mt: 1,
//               maxwidth: 600,
//             }}
//             >
//               Moving this to Qualified will automatically added as Contact
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => {
//                   if (!dropResult) return;
//                   handleCloseAddContact(dropResult);
//                 }}>
//                 Cancel
//               </Button>
//               <Button 
//                 variant="contained"
//                 onClick={() => {
//                   if (!dropResult) return;
//                   handleAddContact(dropResult);
//                 }}
//               >
//                 Proceed
//               </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog sx={{position: "absolute"}} open={openInvalid} onClose={handleCloseInvalid}>
//           <DialogTitle sx={{fontWeight: 700}}>
//             Unable to update as Qualified
//           </DialogTitle>  

//           <DialogContent
//             sx = {{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               mt: 1,
//               maxwidth: 600,
//             }}
//             >
//               Please update the Lead's contact details first before moving to Qualified(Email/Phone)
//             </DialogContent>
//             <DialogActions>
//               <Button 
//                 variant="contained"
//                 onClick={() => {
//                   handleCloseInvalid();
//                 }}
//               >
//                 OK
//               </Button>
//           </DialogActions>
//         </Dialog>
//         <Dialog sx={{position: "absolute"}} open={openEditConfirmation} onClose={handleCloseEditConfirmation}>
//           <DialogTitle sx={{fontWeight: 700}}>
//             CONFIRMATION
//           </DialogTitle>  

//           <DialogContent
//             sx = {{
//               display: "flex",
//               flexDirection: "column",
//               gap: 2,
//               mt: 1,
//               maxwidth: 600,
//             }}
//             >
//               Are you sure you want to edit this lead?
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleCloseEditConfirmation}>
//                 Cancel
//               </Button>
//               <Button 
//                 variant="contained"
//                 onClick={() => {
//                   handleCloseEditConfirmation();
//                   handleEdit();
//                 }}
//               >
//                 Yes
//               </Button>
//           </DialogActions>
//         </Dialog>
//         <Popover
//           disableRestoreFocus
//           sx={{ pointerEvents: 'none' }}
//           open={Boolean(anchorEl)}
//           anchorEl={anchorEl}
//           onClose={handleMouseLeave}
//           anchorOrigin={{
//             vertical: 'bottom',
//             horizontal: 'left',
//           }}
//         >
//           <Card sx={{ p: 2, width: 350,
//                 whiteSpace: 'normal',
//                 overflowWrap: 'break-word',
//               }}>
//             <Box sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               height: 75
//             }}>
//               <Box sx={{
//                 height: '100%',
//                 width: 75,
//                 border: '1px solid #ccc',
//                 borderRadius: 50,
//               }}>
//                 <PersonIcon sx={{width: '100%', height: '90%', opacity: 0.8}}/>
//               </Box>
//             </Box>
//             <Box sx={{
//               display: 'flex',
//               justifyContent: 'space-between'
//             }}>
//               <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}>
//                 <Typography variant="h6" fontWeight={700}>
//                   {formatName(hoveredLead?.first_name, hoveredLead?.last_name)} {hoveredLead?.suffix}
//                   {hoveredLead?.priority === 'High' ? (
//                   <PriorityIcon 
//                   sx={{
//                     fontSize: '15px',
//                     ml: 1, 
//                     color: PRIORITY_COLORS['High'],
//                     border: `1px solid ${PRIORITY_COLORS['High']}`,
//                     borderRadius: 20,
//                   }}/>
//                 ) : hoveredLead?.priority === 'Highest' ? (
//                   <PriorityIcon sx={{
//                     fontSize: '15px',
//                     ml: 1, 
//                     color: PRIORITY_COLORS['Highest'],
//                     border: `1px solid ${PRIORITY_COLORS['Highest']}`,
//                     borderRadius: 20,
//                   }} />
//                 ) : null}
//                 </Typography>

//                 {hoveredLead?.email && (
//                 <Typography variant="body2">
//                   {hoveredLead?.email}
//                 </Typography>
//                 )}
//                 {hoveredLead?.phone && (
//                 <Typography variant="body2">
//                   {hoveredLead?.phone}
//                 </Typography>
//                 )}
//               </Box>
//               <Box sx={{
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}>
//                 {hoveredLead?.gender !== 'Prefer not to say' && (
//                 <Typography variant="body2">
//                   {hoveredLead?.gender }
//                 </Typography>
//                 )}
//                 {hoveredLead?.birth_date && (
//                 <Typography variant="body2">
//                   Age: {!hoveredLead?.birth_date
//                   ? ''
//                   : calculateAge(hoveredLead.birth_date)}
//                 </Typography>
//                 )}
//               </Box>
//             </Box>
//             <Box 
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//             }}>
//               {hoveredLead?.facebook && (
//                 <Typography variant="body2">
//                   Facebook: facebook.com/{hoveredLead.facebook}
//                 </Typography>
//               )}
//               {hoveredLead?.instagram && (
//                 <Typography variant="body2">
//                   Instagram: @{hoveredLead.instagram}
//                 </Typography>
//               )}
//               {hoveredLead?.tiktok && (
//                 <Typography variant="body2">
//                   TikTok: @{hoveredLead.tiktok}
//                 </Typography>
//               )}
//               {hoveredLead?.x && (
//                 <Typography variant="body2">
//                   X/Twitter: @{hoveredLead.x}
//                 </Typography>
//               )}
//               {hoveredLead?.linkedin && (
//                 <Typography variant="body2">
//                   LinkedIn: linkedin.com/in/{hoveredLead.linkedin}
//                 </Typography>
//               )}
//               {hoveredLead?.telegram && (
//                 <Typography variant="body2">
//                   Telegram: @{hoveredLead.telegram}
//                 </Typography>
//               )}
//               {hoveredLead?.whatsapp && (
//                 <Typography variant="body2">
//                   WhatsApp: {hoveredLead.whatsapp}
//                 </Typography>
//               )}
//               {hoveredLead?.viber && (
//                 <Typography variant="body2">
//                   Viber: {hoveredLead.viber}
//                 </Typography>
//               )}
//             </Box>
//             <Divider sx={{mt: 2, mb: 1}}></Divider>
//             <Typography marginBottom={1} variant="body1" fontWeight={700}>
//               {hoveredLead?.title.toUpperCase()}
//             </Typography>
//             <Typography variant="body2">
//               {hoveredLead?.notes}
//             </Typography>
//           </Card>
//         </Popover>
//         <Snackbar
//           open={openSnackbar}
//           autoHideDuration={3000}
//           onClose={() => setOpenSnackbar(false)}
//           message="This feature is coming soon!"
//         />
//     </Box>
//   );
// }

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
// import { useAuthContext } from '../../../hooks/useAuthContext'

import {
  updateLead,
  deleteLead, 
  moveLeadLocally,
  updateLeadStatus,
  clearError,
  fetchLeadsLists,
} from '../../../store/leadsSlice';
import { LEAD_STATUSES, type Lead, type LeadStatus, type UpdateLead } from '../../../types/lead';

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';

import {
  Box,
  Typography,
  Button,
  Snackbar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
  Chip,
  Popover,
  InputAdornment,
  Divider,
  Autocomplete,
  Avatar,
  Stack,
  Tooltip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import SmsIcon from '@mui/icons-material/Sms';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import PriorityIcon from '@mui/icons-material/PriorityHighRounded';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import ShareIcon from '@mui/icons-material/Share';
import NotesIcon from '@mui/icons-material/Notes';
// import { useAuth } from "../../../hooks/useAuth";
import ErrorAlert from "../../../components/Error";
import { DEPARTMENTS, GENDERS, INDUSTRIES, PREFERRED_CONTACT_TIMES, PRIORITIES, SOURCES, SUFFIXES, type Gender, type PreferredTime, type Priority, type Source, type Suffix } from "../../../types/global";
import { formatName, formatShortTitle } from "../../../utils/formatText";
import { calculateAge } from "../../../utils/calculateAge";

const PRIORITY_COLORS: Record<Priority, string> = {
  Highest: '#df3232',
  High: '#cc9e1fd0',
  Low: '#ffffff00',
}

// --- Presentation-only helpers/styles. These do not touch lead data or app
// logic — they only decide how existing fields are laid out and labeled. ---
const fieldSx = {
  '& .MuiInputBase-input': { py: '6px', fontSize: 14 },
  '& .Mui-disabled': { opacity: 0.85 },
} as const;

function SectionHeader({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mb: 0.25 }}>
      {icon}
      <Typography variant="subtitle2" fontWeight={700} sx={{ whiteSpace: 'nowrap' }}>
        {children}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  if (priority !== 'High' && priority !== 'Highest') return null;
  const color = PRIORITY_COLORS[priority];
  return (
    <Chip
      size="small"
      icon={<PriorityIcon style={{ fontSize: 12, color }} />}
      label={priority}
      variant="outlined"
      sx={{
        height: 18,
        fontSize: 9,
        fontWeight: 700,
        color,
        borderColor: alpha(color, 0.6),
        "& .MuiChip-label": { px: 0.5 },
      }}
    />
  );
}

export default function Leads() {
  const themeMode = useSelector((state: RootState) => state.ui.themeMode);
  const {items: leads, loading, loaded,  error } = useSelector((state: RootState) => state.leads);
  const dispatch = useDispatch<AppDispatch>();
  // const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [edit, setEdit] = useState(false);
  
  const [dropResult, setDropResult] = useState<DropResult | null>(null)
  const [openDelete, setOpenDelete] = useState(false);
  const [invalid, setInvalid] = useState('');
  const [openAddContact, setOpenAddContact] = useState(false);
  const [openInvalid, setOpenInvalid] = useState(false);
  const [openEditConfirmation, setOpenEditConfirmation] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<UpdateLead | null>();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [hoveredLead, setHoveredLead] = useState<Lead | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  const [search, setSearch] = useState<Record<LeadStatus, string>>({
    New: '',
    Contacted: '',
    Qualified: '',
    Closed: '',
  });
  const [form, setForm] = useState<UpdateLead>({
    id: "",
    title: "",
    first_name: "",
    last_name: "",
    suffix: null as Suffix,
    email: null,
    phone: null,
    gender: "Prefer not to say" as Gender,
    birth_date: null,
    industry: "",
    company_name: "",
    department: "",
    position: "",
    website: "",
    source: "Other" as Source,
    priority: "Low" as Priority,
    notes: "",
    facebook: "",
    x: "",
    whatsapp: "",
    linkedin: "",
    instagram: "",
    telegram: "",
    tiktok: "",
    viber: "",
    preferred_contact_time: "Anytime" as PreferredTime,
  });



  
  
  useEffect(() => {
    if (loading) return;

    const loadData = async () => {
      try {

        if (!loaded) {
          await dispatch(fetchLeadsLists()).unwrap();
        }
      } catch {
        // Error handled by Redux state
      }
    };
    loadData();
  }, [
    loading,
    loaded,
    dispatch,
  ]);

  const handleOpenDelete = (lead: Lead) => {
    setSelectedLead(lead); 
    setOpenDelete(true);
    };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  }
  const handleOpenEditConfirmation = () => {
    setOpenEditConfirmation(true);
  }
  const handleCloseEditConfirmation = () => {
    setOpenEditConfirmation(false);
  } 
  const handleOpenAddContact = (result: DropResult) => {
    setOpenAddContact(true);
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    const oldStatus = result.source.droppableId as LeadStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (newStatus === oldStatus) return;
  }

  const handleCloseAddContact = (result: DropResult) => {
    const leadId = result.draggableId;
    const oldStatus = result.source.droppableId as LeadStatus;

    const newStatus = oldStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    dispatch(moveLeadLocally({id: leadId, newStatus}));
    setOpenAddContact(false);
  };

  const handleCloseInvalid = () => {
    setOpenInvalid(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteLead(id)).unwrap();
  };

  const handleOpenEdit = (lead: UpdateLead) => {
    setForm({
      id: lead.id,
      title: lead.title,
      first_name: lead.first_name,
      last_name: lead.last_name,
      suffix: lead.suffix as Suffix || null ,
      gender: lead.gender as Gender,
      birth_date: lead.birth_date || null ,
      email: lead.email || null || '',
      phone: lead.phone || null || '',
      industry: lead.industry || '',
      company_name: lead.company_name || '',
      position: lead.position || '',
      department: lead.department || '',
      website: lead.website || '',
      source: lead.source as Source,
      priority: lead.priority as Priority,
      notes: lead.notes || '',
      preferred_contact_time: lead.preferred_contact_time as PreferredTime,
      facebook: lead.facebook || '',
      x: lead.x || '',
      whatsapp: lead.whatsapp || '',
      linkedin: lead.linkedin || '',
      instagram: lead.instagram || '',
      telegram: lead.telegram || '',
      tiktok: lead.tiktok || '',
      viber: lead.viber || '',
    });
    setEditingLead(lead);
    setIsEditing(true);
    setEdit(false);
  };

  const handleCloseEdit = () => {
    dispatch(clearError());
    setEdit(false);
    setIsEditing(false);
    setOpenEditConfirmation(false);
  } 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditable = () => {
    setEdit(true);
  }
  const handleNotEditable = () => {
    setEdit(false);
  }
  const handleEdit = async () => {
    if (loading) return;

    try {
      setEdit(false);
    
      if (!editingLead) return;

      const leadId = editingLead.id;
      await dispatch(updateLead({ id: leadId, lead: form as Lead })).unwrap();
      setIsEditing(false);
    } catch {
      setIsEditing(true);
      setEdit(true);
      if (!editingLead) return;
    }
    
  };

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    lead: Lead
  ) => {
    setAnchorEl(event.currentTarget);
    setHoveredLead(lead);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
    setHoveredLead(null);
  };

  const handleAddContact = async (result: DropResult) => {

    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    const oldStatus = result.source.droppableId as LeadStatus;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (newStatus === oldStatus) return;


    if (!lead.email?.trim() && !lead.phone?.trim()) {
      setOpenInvalid(true);
      handleCloseAddContact(result);
      return;
    }

    await dispatch(updateLeadStatus({ id: leadId, status: newStatus })).unwrap();
    
    navigate('/app/contacts');
  }

  const handleDragEnd = async (result: DropResult) => {
    setDropResult(result);

    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId as LeadStatus;
    const oldStatus = result.source.droppableId as LeadStatus;

    if (newStatus === oldStatus) return;

    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    if (
      oldStatus === 'Qualified' &&
      ['New', 'Contacted', 'Closed'].includes(newStatus)
    ) {
      const message =
        newStatus === 'Closed'
          ? `This lead is already in Contacts. Unable to change the status to '${newStatus}'. Please change the status in Contacts instead.`
          : `This lead is already in Contacts. Unable to change the status back to '${newStatus}'.`;

      setInvalid(message);
      setTimeout(() => setInvalid(''), 3000);
      return;
    }

    if (oldStatus === 'Closed' && 
      ['New', 'Contacted', 'Qualified'].includes(newStatus)) {
      setInvalid(
        `This lead already exists. Unable to change the status back to '${newStatus}'.`
      );
      setTimeout(() => setInvalid(''), 3000);
      return;
    }

    dispatch(moveLeadLocally({ id: leadId, newStatus }));

    if (newStatus === 'Qualified') {
      handleOpenAddContact(result);
    } else {
      await dispatch(updateLeadStatus({ id: leadId, status: newStatus })).unwrap();
    }
  };
  

  const getLeadsByStatus = (status: LeadStatus) => {
    const query = search[status].toLowerCase().trim();

    return leads
      .filter((lead) => lead.status === status)
      .filter((lead) => {
        if (!query) return true;

        const searchableText = [
          lead.first_name,
          lead.last_name,
          lead.suffix,
          lead.email,
          lead.phone,
          lead.title,
          lead.notes
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(query);
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, height: 1200 }}>
        <CircularProgress />
      </Box>
    );
  }

  

  return (
    <Box sx={{height: 1000}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '80vw',
        maxWidth: 1400,
        mx: 'auto',
        mb: 1,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight={700}>
            Leads
          </Typography>

          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            onClick={() => navigate(`/app/addlead`)}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            Add Lead
          </Button>
        </Box>

        {(error || invalid) && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <ErrorAlert
              message={(error || invalid) ?? "An unknown error occurred."}
            />
          </Box>
        )}
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{display: 'flex', gap: 2, pb: 2, overflow: 'auto', width: '80vw', maxWidth: 1400, mb: 2,  p: '10px', borderRadius: 2, mx: 'auto' }}>
          {LEAD_STATUSES.map((column) =>(
            <Box
              key={column}
              sx={{ width: '100%' ,minWidth: 260, flex: 1}}
            >
              <Box
                sx={(theme) => ({
                  px: 2,
                  py: 1.25,
                  borderRadius: '10px 10px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'grey.800'
                    : 'grey.200',
                })}
                >
                <Typography fontWeight={700} variant="subtitle1" sx={{ whiteSpace: 'nowrap' }}>
                  {column}
                </Typography>
                <TextField
                  size="small"
                  placeholder="Search"
                  value={search[column]}
                  onChange={(e) =>
                    setSearch((prev) => ({
                      ...prev,
                      [column]: e.target.value,
                    }))
                  }
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon sx={{ opacity: 0.5 }} fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    bgcolor: 'background.paper',
                    borderRadius: 5,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiInputBase-input': {
                      py: '4px',
                      fontSize: 12,
                    },
                  }}
                />
                <Chip
                  label={getLeadsByStatus(column).length}
                  size="small"
                  sx={{ fontWeight: 700, bgcolor: 'background.paper' }}
                  />
              </Box>
              <Droppable droppableId={column}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: 500,
                      bgcolor: snapshot.isDraggingOver
                        ? 'action.hover'
                        : 'background.paper',
                      overflowY: 'auto',
                      borderRadius: '0 0 10px 10px',
                      p: 1,
                      transition: 'background-color 0.2s ease',
                      height: 850,
                    }}
                  >
                    {getLeadsByStatus(column).map((lead, index) => (
                      <Draggable
                        key={lead.id}
                        draggableId={lead.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              mb: 1.25,
                              borderRadius: 2,
                              border: '1px solid',
                              borderColor: snapshot.isDragging ? 'primary.main' : 'divider',
                              boxShadow: snapshot.isDragging ? 6 : 0,
                              cursor: 'grab',
                              opacity: snapshot.isDragging ? 0.9 : 1,
                              transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                              '&:hover': { borderColor: 'primary.main' },
                            }}
                          >
                            <CardContent sx={{ p: 1.25, '&:last-child': { pb: 1.25 }, display: 'flex', gap: 1.25 }}>
                              <Avatar
                                onMouseEnter={(e) => handleMouseEnter(e, lead)}
                                onMouseLeave={handleMouseLeave}
                                sx={{
                                  width: 38,
                                  height: 38,
                                  mt: '2px',
                                  cursor: 'pointer',
                                  bgcolor: 'action.hover',
                                  flexShrink: 0,
                                }}
                              >
                                <PersonIcon sx={{ opacity: 0.65, color: 'text.secondary' }}/>
                              </Avatar>
                              <Box flex={1} minWidth={0}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 0.5}}>
                                  <Typography
                                  title="Lead Title"
                                  sx={{
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: 700,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}>
                                  {formatShortTitle(lead.title).toUpperCase()}
                                  </Typography>
                                  <Box
                                    title={`${lead.priority} Priority`}
                                   sx={{display: 'flex', alignItems: 'center', gap: 0.25, cursor: 'pointer', flexShrink: 0}}>
                                    <PriorityBadge priority={lead.priority} />
                                     <IconButton
                                      size="small"
                                      onClick={() => handleOpenEdit(lead)}
                                    >
                                      <InfoIcon titleAccess="Full details" fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  
                                </Box>
                                <Box
                                  title="Lead full name"
                                  sx={{ display: 'flex', cursor: 'pointer'}}>
                                    <Typography sx={{fontSize: '11px', fontWeight: 600, opacity: 0.75}}>
                                    {formatName(lead.first_name, lead.last_name)} {lead.suffix} 
                                  </Typography>
                                </Box>
                                {lead.notes && (
                                  <Typography
                                    title="Lead Notes"
                                    variant="caption"
                                    color="text.secondary"
                                    display="block"
                                    sx={{
                                      mt: 0.5,
                                      width: '100%',
                                      fontStyle: 'italic',
                                      wordBreak: 'break-word',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {lead.notes.length > 100
                                    ? `${lead.notes.slice(0, 100)}...`
                                    : lead.notes}
                                  </Typography>
                                )}
                                <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', rowGap: 0.5 }}>
                                  <Chip
                                    title="Deal Owner"
                                    label={formatName(lead.owner.first_name, lead.owner.last_name)}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ height: 18, fontSize: 9, fontWeight: 700, cursor: 'pointer', "& .MuiChip-label": { px: 0.75 } }}
                                  />
                                  <Chip
                                    title="Preferred Time to contact"
                                    label={lead.preferred_contact_time}
                                    size="small"
                                    variant="outlined"
                                    sx={{ height: 18, fontSize: 9, cursor: 'pointer', "& .MuiChip-label": { px: 0.75 } }}
                                  />
                                </Stack>
                                <Box sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: 0.5,
                                }}>
                                  <Stack direction="row" spacing={0.25}>
                                    <Tooltip title="Email lead">
                                      <IconButton size="small" onClick={() => setOpenSnackbar(true)}>
                                        <EmailIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Call lead">
                                      <IconButton size="small" onClick={() => setOpenSnackbar(true)}>
                                        <CallIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Message lead">
                                      <IconButton size="small" onClick={() => setOpenSnackbar(true)}>
                                        <SmsIcon fontSize="small" sx={{ color: 'primary.main' }} />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                  <Tooltip title="Delete lead">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleOpenDelete(lead)}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box> 
                              </Box>
                              
                              
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
      <Dialog
        PaperProps={{
          sx: {
            position: "absolute",
            backgroundColor: themeMode === 'dark' ? '#30303065' : '#ffffffa9',
            borderRadius: 3,
            minWidth: 340,
          },
        }}
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
          <DeleteIcon color="error" fontSize="small" />
          Confirm deletion
        </DialogTitle>

        <DialogContent
          sx = {{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 1,
            maxWidth: 600,
          }}
          >
            Are you sure you want to delete this lead: <b>{selectedLead?.first_name} {selectedLead?.last_name} {selectedLead?.suffix}?</b>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDelete} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              disableElevation
              color="error"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                if (selectedLead) {
                  handleDelete(selectedLead.id);
                }
                handleCloseDelete();
              }}
              >
                Yes, delete
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog  sx={{position: "absolute", maxHeight: 800, top: 100 }} maxWidth="md" open={isEditing} onClose={handleCloseEdit} PaperProps={{ sx: { borderRadius: 3 } }}>
          
          <DialogActions sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            pt: 1.5,
          }}>
            <Tooltip title="Edit lead">
              <IconButton
                size="small"
                onClick={handleEditable}
                sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: 2 }}
              >
                <EditIcon titleAccess="Edit" color="primary" sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton
                size="small"
                onClick={handleCloseEdit}
                sx={{
                  bgcolor: 'error.main',
                  color: 'common.white',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <CloseIcon titleAccess="Close" sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 2,
            mx: 5,
            mb: 1,
          }}>
          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              width: {
                xs: 250,
                sm: 300,
                md: 400,
                lg: 500
              },
            }}>
            <Box sx={{
              display: "flex",
              width: '100%',
              flexDirection: 'column',
              overflow: 'auto',
              justifyContent: "center",
              gap: 1,
              
              '& .MuiTextField-root': {
                  userSelect: edit === true ? 'auto' : 'none',
                },
            }}>
              {isEditing && error && (
                <ErrorAlert
                  message={error}
                />
              )}
              <SectionHeader icon={<PersonIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Personal Details
              </SectionHeader>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
                
              }}>
                <TextField
                  disabled={!edit}
                  label="First Name"
                  name="first_name"
                  required
                  value={!edit && !form.first_name ? 'Not provided' : form.first_name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />

                <TextField
                  disabled={!edit}
                  label="Last Name"
                  name="last_name"
                  value={!edit && !form.last_name ? 'Not provided' : form.last_name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  select
                  disabled={!edit}
                  label="Suffix"
                  name="suffix"
                  onChange={handleChange}
                  value={!edit && !form.suffix ? 'None' : form.suffix}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                    select: {
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 250,
                          },
                        },
                      },
                    },
                  }}
                >
                {SUFFIXES.map((suffix) => (
                    <MenuItem key={suffix} value={suffix}>
                      {suffix}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  disabled={!edit}
                  type="tel"
                  label="Phone"
                  name="phone"
                  value={!edit && !form.phone ? 'Not provided' : form.phone}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Box>
              
              <TextField
                disabled={!edit}
                label="Email"
                name="email"
                value={!edit && !form.email ? 'Not provided' : form.email}
                onChange={handleChange}
                size="small"
                sx={fieldSx}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  select
                  disabled={!edit}
                  label="Gender"
                  name="gender"   
                  onChange={handleChange}
                  value={form.gender }
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                >
                {GENDERS.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
                </TextField>
                <TextField
                  disabled={!edit}
                  label="Date of Birth"
                  name="birth_date"
                  type="date"
                  value={form.birth_date}
                  onChange={handleChange}
                  slotProps={{ inputLabel: { shrink: true } }}
                  size="small"
                  sx={{
                    width: '50%',
                    '& input' : {
                      colorScheme: themeMode === 'dark' ? 'dark' : 'light', 
                    },
                    ...fieldSx,
                  }}
                />
              </Box>
              <SectionHeader icon={<WorkIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Professional Details
              </SectionHeader>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <Autocomplete
                  freeSolo
                  disabled={!edit}
                  sx={{ width: '50%',
                    '& .MuiOutlinedInput-root': {
                      height: 28 
                    },
                    }}
                  options={DEPARTMENTS}
                  value={!edit && !form.department ? 'Not provided' : form.department}
                  onChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      department: value ?? '',
                    }));
                  }}
                  onInputChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      department: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      slotProps={{ inputLabel: { shrink: true } }}
                      label="Department"
                      size="small"
                      sx={fieldSx}
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  disabled={!edit}
                  sx={{
                    width: '50%',
                    '& .MuiOutlinedInput-root': {
                      height: 28 
                    },
                  }}
                  options={INDUSTRIES}
                  value={!edit && !form.industry ? 'Not provided' : form.industry}
                  onChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      industry: value ?? '',
                    }));
                  }}
                  onInputChange={(_, value) => {
                    setForm(prev => ({
                      ...prev,
                      industry: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      slotProps={{ inputLabel: { shrink: true } }}
                      label="Industry"
                      size="small"
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                
                <TextField
                  disabled={!edit}
                  label="Company"
                  name="company_name"
                  value={!edit && !form.company_name ? 'Not provided' : form.company_name}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Position"
                  name="position"
                  value={!edit && !form.position ? 'Not provided' : form.position}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <TextField
                  disabled={!edit}
                  label="Website Url"
                  name="website"
                  value={!edit && !form.website ? 'Not provided' : form.website}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '100%',
                    ...fieldSx,
                  }}
                />
              <SectionHeader icon={<ShareIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Social and Messaging Accounts
              </SectionHeader>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  disabled={!edit}
                  label="Facebook"
                  name="facebook"
                  value={!edit && !form.facebook ? 'Not provided' : form.facebook}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
                <TextField
                  disabled={!edit}
                  label="X/ Twitter"
                  name="x"
                  value={!edit && !form.x ? 'Not provided' : form.x}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  disabled={!edit}
                  label="Instagram"
                  name="instagram"
                  value={!edit && !form.instagram ? 'Not provided' : form.instagram}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Whatsapp"
                  name="whatsapp"
                  value={!edit && !form.whatsapp ? 'Not provided' : form.whatsapp}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  disabled={!edit}
                  label="Tiktok"
                  name="tiktok"
                  value={!edit && !form.tiktok ? 'Not provided' : form.tiktok}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Telegram"
                  name="telegram"
                  value={!edit && !form.telegram ? 'Not provided' : form.telegram}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  disabled={!edit}
                  label="Linkedin"
                  name="linkedin"
                  value={!edit && !form.linkedin ? 'Not provided' : form.linkedin}
                  slotProps={{ inputLabel: { shrink: true } }}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
              />
                <TextField
                  disabled={!edit}
                  label="Viber"
                  name="viber"
                  value={!edit && !form.viber ? 'Not provided' : form.viber}
                  onChange={handleChange}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                />
              </Box>
              <SectionHeader icon={<NotesIcon fontSize="small" sx={{ opacity: 0.6 }} />}>
                Additional Details
              </SectionHeader>
              <TextField
                disabled={!edit}
                  label="Title"
                  value={form.title}
                  name="title"
                  required
                  onChange={handleChange}
                  size="small"
                  fullWidth
                  rows={3}
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={fieldSx}
                />
              <Box sx={{
                display: "flex",
                width: '100%',
                justifyContent: "space-between",
                gap: 1,
              }}>
                <TextField
                  select
                  disabled={!edit}
                  label="Source"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: '50%',
                    ...fieldSx,
                  }}
                  slotProps={{
                    inputLabel: { shrink: true },
                    select: {
                      MenuProps: {
                        PaperProps: {
                          sx: {
                            maxHeight: 250,
                          },
                        },
                      },
                    },
                  }}
                >
                  {SOURCES.map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  disabled={!edit}
                  label="Preferred Time"
                  name="preferred_contact_time"
                  onChange={handleChange}
                  value={form.preferred_contact_time}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '25%',
                    ...fieldSx,
                  }}
                >
                  {PREFERRED_CONTACT_TIMES.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  disabled={!edit}
                  label="Priority"
                  name="priority"
                  onChange={handleChange}
                  value={form.priority}
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={{
                    width: '25%',
                    ...fieldSx,
                  }}
                >
                  {PRIORITIES.map((prio) => (
                    <MenuItem key={prio} value={prio}>
                      {prio}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <TextField
                label="Notes"
                name="notes"
                required
                disabled={!edit}
                value={form.notes}
                onChange={handleChange}
                size="small"
                multiline
                rows={3}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={fieldSx}
              />    
          </Box > 
          </DialogContent>
          <DialogActions sx={{ display: edit === true ? 'flex' : 'none', px: 3, pb: 2 }}>
            <Button onClick={handleNotEditable} sx={{ textTransform: 'none' }}>
              Cancel
            </Button>
            <Button 
              variant="contained"
              disableElevation
              sx={{ textTransform: 'none' }}
              onClick={() => {
                handleOpenEditConfirmation();
              }}
              >
              Submit
            </Button>
          </DialogActions>
          </Box>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openAddContact} onClose={handleCloseAddContact} PaperProps={{ sx: { borderRadius: 3, minWidth: 340 } }}>
          <DialogTitle sx={{fontWeight: 700}}>
            Move to Qualified?
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
            >
              Moving this to Qualified will automatically add it as a Contact.
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button sx={{ textTransform: 'none' }} onClick={() => {
                  if (!dropResult) return;
                  handleCloseAddContact(dropResult);
                }}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none' }}
                onClick={() => {
                  if (!dropResult) return;
                  handleAddContact(dropResult);
                }}
              >
                Proceed
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openInvalid} onClose={handleCloseInvalid} PaperProps={{ sx: { borderRadius: 3, minWidth: 340 } }}>
          <DialogTitle sx={{fontWeight: 700}}>
            Unable to update as Qualified
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
            >
              Please update the lead's contact details first before moving to Qualified (email or phone).
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none' }}
                onClick={() => {
                  handleCloseInvalid();
                }}
              >
                OK
              </Button>
          </DialogActions>
        </Dialog>
        <Dialog sx={{position: "absolute"}} open={openEditConfirmation} onClose={handleCloseEditConfirmation} PaperProps={{ sx: { borderRadius: 3, minWidth: 340 } }}>
          <DialogTitle sx={{fontWeight: 700}}>
            Confirm changes
          </DialogTitle>  

          <DialogContent
            sx = {{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
              maxWidth: 600,
            }}
            >
              Are you sure you want to edit this lead?
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button sx={{ textTransform: 'none' }} onClick={handleCloseEditConfirmation}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                disableElevation
                sx={{ textTransform: 'none' }}
                onClick={() => {
                  handleCloseEditConfirmation();
                  handleEdit();
                }}
              >
                Yes
              </Button>
          </DialogActions>
        </Dialog>
        <Popover
          disableRestoreFocus
          sx={{ pointerEvents: 'none' }}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMouseLeave}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Card sx={{ p: 2, width: 340,
                borderRadius: 3,
                whiteSpace: 'normal',
                overflowWrap: 'break-word',
              }}>
            <Stack alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'action.hover' }}>
                <PersonIcon sx={{ fontSize: 32, opacity: 0.7, color: 'text.secondary' }}/>
              </Avatar>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
                  {formatName(hoveredLead?.first_name, hoveredLead?.last_name)} {hoveredLead?.suffix}
                  {hoveredLead && <PriorityBadge priority={hoveredLead.priority} />}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.25,
              }}>
                {hoveredLead?.email && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 14, opacity: 0.6 }} /> {hoveredLead?.email}
                </Typography>
                )}
                {hoveredLead?.phone && (
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CallIcon sx={{ fontSize: 14, opacity: 0.6 }} /> {hoveredLead?.phone}
                </Typography>
                )}
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'right',
              }}>
                {hoveredLead?.gender !== 'Prefer not to say' && (
                <Typography variant="body2" color="text.secondary">
                  {hoveredLead?.gender }
                </Typography>
                )}
                {hoveredLead?.birth_date && (
                <Typography variant="body2" color="text.secondary">
                  Age: {!hoveredLead?.birth_date
                  ? ''
                  : calculateAge(hoveredLead.birth_date)}
                </Typography>
                )}
              </Box>
            </Box>
            <Box 
            sx={{
              display: 'flex',
              flexDirection: 'column',
              mt: hoveredLead?.email || hoveredLead?.phone ? 1 : 0,
            }}>
              {hoveredLead?.facebook && (
                <Typography variant="body2" color="text.secondary">
                  Facebook: facebook.com/{hoveredLead.facebook}
                </Typography>
              )}
              {hoveredLead?.instagram && (
                <Typography variant="body2" color="text.secondary">
                  Instagram: @{hoveredLead.instagram}
                </Typography>
              )}
              {hoveredLead?.tiktok && (
                <Typography variant="body2" color="text.secondary">
                  TikTok: @{hoveredLead.tiktok}
                </Typography>
              )}
              {hoveredLead?.x && (
                <Typography variant="body2" color="text.secondary">
                  X/Twitter: @{hoveredLead.x}
                </Typography>
              )}
              {hoveredLead?.linkedin && (
                <Typography variant="body2" color="text.secondary">
                  LinkedIn: linkedin.com/in/{hoveredLead.linkedin}
                </Typography>
              )}
              {hoveredLead?.telegram && (
                <Typography variant="body2" color="text.secondary">
                  Telegram: @{hoveredLead.telegram}
                </Typography>
              )}
              {hoveredLead?.whatsapp && (
                <Typography variant="body2" color="text.secondary">
                  WhatsApp: {hoveredLead.whatsapp}
                </Typography>
              )}
              {hoveredLead?.viber && (
                <Typography variant="body2" color="text.secondary">
                  Viber: {hoveredLead.viber}
                </Typography>
              )}
            </Box>
            <Divider sx={{mt: 2, mb: 1}}></Divider>
            <Typography marginBottom={1} variant="body1" fontWeight={700}>
              {hoveredLead?.title.toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hoveredLead?.notes}
            </Typography>
          </Card>
        </Popover>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message="This feature is coming soon!"
          ContentProps={{ sx: { borderRadius: 2 } }}
        />
    </Box>
  );
}
