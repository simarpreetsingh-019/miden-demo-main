import React from 'react';
import { useNode } from '../contexts/NodeContext';
import { Button, Menu, MenuItem } from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import ComputerIcon from '@mui/icons-material/Computer';

const NodeSelector = () => {
  const { nodeUrl, setNodeUrl, PUBLIC_NODE, LOCAL_NODE } = useNode();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (url) => {
    setNodeUrl(url);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        startIcon={
          nodeUrl === PUBLIC_NODE ? <CloudQueueIcon /> : <ComputerIcon />
        }
      >
        {nodeUrl === PUBLIC_NODE ? 'Public Testnet' : 'Local Node'}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          selected={nodeUrl === PUBLIC_NODE}
          onClick={() => handleSelect(PUBLIC_NODE)}
        >
          <CloudQueueIcon fontSize="small" sx={{ mr: 1 }} /> Public Testnet
        </MenuItem>
        <MenuItem
          selected={nodeUrl === LOCAL_NODE}
          onClick={() => handleSelect(LOCAL_NODE)}
        >
          <ComputerIcon fontSize="small" sx={{ mr: 1 }} /> Local Node
        </MenuItem>
      </Menu>
    </>
  );
};

export default NodeSelector;
