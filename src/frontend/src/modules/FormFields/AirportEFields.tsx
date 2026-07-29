'use client';

import { Grid, Paper, Typography } from '@mui/material';

import ControlTextField from '@/components/TextField';

interface AirportEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const AirportEFields = ({ isNew = false }: AirportEFieldsProps) => {
  return (
    <>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Grid
          container
          spacing={1.5}
          alignItems="flex-end"
        >
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="code"
              name="code"
              label="Code"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="name"
              name="name"
              label="Name"
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default AirportEFields;
