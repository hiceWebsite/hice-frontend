import Link from "next/link";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import { DrawerItem } from "@/types";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

type IProps = {
  item: DrawerItem;
};

const SidebarItem = ({ item }: IProps) => {
  const pathname = usePathname();
  const linkPath = `/dashboard/${item.path}`;
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // If item has children, render parent + collapse
  if (item.child && item.child.length > 0) {
    return (
      <>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton onClick={handleToggle}>
            <ListItemIcon>{item.icon && <item.icon />}</ListItemIcon>
            <ListItemText primary={item.title} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.child.map((sub) => {
              const subPath = `/dashboard/${sub.path}`;
              return (
                <Link key={sub.title} href={subPath}>
                  <ListItem
                    disablePadding
                    sx={{
                      pl: 4,
                      ...(pathname === subPath
                        ? {
                            borderRight: "3px solid #1586FD",
                            "& svg": {
                              color: "#1586FD",
                            },
                          }
                        : {}),
                      mb: 1,
                    }}
                  >
                    <ListItemButton>
                      <ListItemText primary={sub.title} />
                    </ListItemButton>
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </Collapse>
      </>
    );
  }

  // Default: leaf item
  return (
    <Link href={linkPath}>
      <ListItem
        disablePadding
        sx={{
          ...(pathname === linkPath
            ? {
                borderRight: "3px solid #1586FD",
                "& svg": {
                  color: "#1586FD",
                },
              }
            : {}),
          mb: 1,
        }}
      >
        <ListItemButton>
          <ListItemIcon>{item.icon && <item.icon />}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default SidebarItem;
