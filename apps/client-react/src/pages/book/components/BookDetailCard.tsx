import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import BookBooking from "../../../pages/booking/BookBooking";
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

  const truncateDescription = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <Card
      sx={{
        margin: "auto",
        borderRadius: 3,
        boxShadow: 4,
        overflow: "hidden",
      }}
    >
      <CardMedia component="img" height="400" image={coverUrl} alt={name} />

      <CardContent>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              {author}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Date de parution : {formatDate(releaseDate)}
            </Typography>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ mt: 2, mb: 2 }}
            >
              {truncateDescription(description, 200)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <BookBooking />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
