'use client';

import { Grid, Paper, Typography } from '@mui/material';

import ControlTextField from '@/components/TextField';

interface HelicopterEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const HelicopterEFields = ({ isNew = false }: HelicopterEFieldsProps) => {
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
              id="rotorDiameter"
              name="rotorDiameter"
              label="Rotor diameter"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="maxAltitude"
              name="maxAltitude"
              label="Max altitude"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="registrationNumber"
              name="registrationNumber"
              label="Registration number"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="model"
              name="model"
              label="Model"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="capacity"
              name="capacity"
              label="Capacity"
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default HelicopterEFields;
