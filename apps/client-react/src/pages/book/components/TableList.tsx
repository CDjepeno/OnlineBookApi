import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableContainerProps,
  TableHead,
  TableRow,
} from "@mui/material";
import { ReactNode } from "react";

export interface TableListProps extends TableContainerProps {
  headCells: string[];
  rows: {
    cells: ReactNode[];
  }[];
  isLoading?: boolean;
}

export function TableList({ headCells, rows, isLoading }: TableListProps) {
  return (
    <TableContainer component={Paper}>
      <Grid item xs={12} sm={6} md={4}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {headCells.map((cell, index) => (
                <TableCell width={index === 0 ? 0 : undefined} key={index}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading &&
              rows.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {row.cells.map((cell, cellIndex) => (
                    <TableCell
                      width={cellIndex === 0 ? "fit-content" : undefined}
                      key={cellIndex}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Grid>
    </TableContainer>
  );
}
