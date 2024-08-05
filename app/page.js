"use client";
import { firebaseConfig } from "@/firebase";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

// Initialize Firebase app and get Firestore instance
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    const pantryCollection = collection(firestore, "pantry-app");
    const q = query(pantryCollection);
    const snapshot = await getDocs(q);
    const pantryList = [];
    snapshot.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    if (item.trim()) {
      const normalizedItem = item.trim().toLowerCase();
      const docRef = doc(collection(firestore, "pantry-app"), normalizedItem);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
      } else {
        await setDoc(docRef, { count: 1 });
      }
      await updatePantry();
    }
  };

  const removeItem = async (item) => {
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, "pantry-app"), normalizedItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const searchItem = () => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const foundItem = pantry.find((item) => item.name === normalizedQuery);
    if (foundItem) {
      setSearchResult({ found: true, item: foundItem });
    } else {
      setSearchResult({ found: false });
    }
  };

  const clearSearchResult = () => {
    setSearchResult(null);
  };

  return (
    <Box
      width="100vw"
      minHeight="150px"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box display="flex" gap={2} alignItems="center" sx={{ mt: 2 }}>
        <TextField
          id="search-input"
          label="Search Item"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={searchItem}>
          Search
        </Button>
      </Box>

      {searchResult && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid #333",
            borderRadius: 2,
            position: "relative",
            width: "400px",
            bgcolor: searchResult.found ? "#f0f0f0" : "#ffdddd",
          }}
        >
          <IconButton
            size="small"
            onClick={clearSearchResult}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {searchResult.found ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {searchResult.item.name.charAt(0).toUpperCase() +
                  searchResult.item.name.slice(1)}
              </Typography>
              <Typography>Quantity: {searchResult.item.count}</Typography>
            </Box>
          ) : (
            <Typography color="red">
              The item "{searchQuery}" is not present in the pantry.
            </Typography>
          )}
        </Box>
      )}

      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>
      <Box border="1px solid #333">
        <Box width="800px" height="100px" bgcolor="#ADD8E6">
          <Typography variant="h2" color="#333" textAlign="center">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {pantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              height="300px"
              display="flex"
              justifyContent={"space-between"}
              alignItems="center"
              bgcolor="#f0f0f0"
              paddingX={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant="h3" color="#333" textAlign="center">
                Quantity: {count}
              </Typography>

              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
