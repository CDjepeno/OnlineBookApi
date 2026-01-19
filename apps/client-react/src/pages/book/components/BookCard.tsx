import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { BOOK_ROUTE } from "../../../request/route-http/route-http";
import { formatDate } from "../../../utils/formatDate";

interface BookCardProps {
  id: string;
  name: string;
  author: string;
  description: string;
  releaseAt: Date | string;
  coverUrl: string;
}

export default function BookCard({
  id,
  name,
  author,
  description,
  releaseAt,
  coverUrl,
}: BookCardProps) {


  const truncateDescription = (description: string, limit: number) => {
    return description.length > limit
      ? description.substring(0, limit) + "..."
      : description;
  };
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia
          component="div"
          sx={{
            pt: "56.25%",
          }}
          image={coverUrl || "default_image_url_here"}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography>{author}</Typography>
          <Typography>{truncateDescription(description, 100)}</Typography>
          <Typography>Date de parution : {formatDate(releaseAt)}</Typography>
        </CardContent>
        <CardActions>
          <Button
            component={Link}
            to={`${BOOK_ROUTE}/${id}`}
            color="primary"
            size="small"
          >
            VOIR PLUS
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
