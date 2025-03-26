"use client"

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { BOOK_ROUTE } from "@/request/route-http/route-http";
import { formatDate } from "@/utils/formatDate";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  description: string;
  releaseAt: Date | string;
  coverUrl: string;
}

export default function BookCard({
  id,
  title,
  author,
  description,
  releaseAt,
  coverUrl,
}: BookCardProps) {
  const releaseDate =
    typeof releaseAt === "string" ? new Date(releaseAt) : releaseAt;

  const truncateDescription = (description: string, limit: number) => {
    return description.length > limit
      ? description.substring(0, limit) + "..."
      : description;
  };
  return (
    <Card
      sx={{
        height: "350px",
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
          {title}
        </Typography>
        <Typography>{author}</Typography>
        <Typography>{truncateDescription(description, 100)}</Typography>
        <Typography>Date de parution : {formatDate(releaseDate)}</Typography>
      </CardContent>
      <CardActions>
        <Link href={`${BOOK_ROUTE}/${id}`}>
          <Button color="primary" size="small">
            VOIR PLUS
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}
