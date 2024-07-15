import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { formatDate } from "../../../utils/formatDate";

interface BookCardDetailProps {
  name: string;
  author: string;
  description: string;
  releaseAt: Date | string;
  coverUrl: string;
}

export default function BookCardDetail({
  name,
  author,
  description,
  releaseAt,
  coverUrl,
}: BookCardDetailProps) {
  const releaseDate =
    typeof releaseAt === "string" ? new Date(releaseAt) : releaseAt;

  const truncateDescription = (description: string, limit: number) => {
    return description.length > limit
      ? description.substring(0, limit) + "..."
      : description;
  };
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardMedia component="img" height="400" image={coverUrl} alt={name} />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date de parution : {formatDate(releaseDate)}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {truncateDescription(description, 100)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
