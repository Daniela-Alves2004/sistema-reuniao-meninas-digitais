import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

require('./PopUp.css');

const PopUp = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent className="DialogContent">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default PopUp;