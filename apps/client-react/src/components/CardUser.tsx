import { Email, Phone } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { FC } from "react";

type UserCard = {
  sexe: string|undefined;
  name: string|undefined;
  email: string|undefined;
  phone: string|undefined;
};

const UserCard: FC<UserCard> = ({ sexe, name, email, phone }) => {
  return (
    <Card sx={{ maxWidth: 345, margin: "auto", mt: 4, boxShadow: 3 }}>
      <CardHeader
        avatar={<Avatar src={
          (sexe === "homme"
            ? "https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie"
            : "https://api.dicebear.com/9.x/adventurer/svg?seed=Katherine")
        } alt={name} />}
        title={<Typography variant="h6">{name}</Typography>}
        subheader={
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          <IconButton size="small" color="primary" sx={{ mr: 1 }}>
            <Email fontSize="small" />
          </IconButton>
          {email}
        </Typography>
        <Typography variant="body1">
          <IconButton size="small" color="primary" sx={{ mr: 1 }}>
            <Phone fontSize="small" />
          </IconButton>
          {phone}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
