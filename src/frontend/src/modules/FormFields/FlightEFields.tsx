'use client';

import { Grid, Paper, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ControlDataTableEditor, { ControlColumnEditor, OptionsEnum } from '@/components/DataTableEditor';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlDatePicker from '@/components/DatePicker';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import useGetAllAircraft from '@/hooks/Aircraft/useGetAllAircraft';
import useGetAllAirport from '@/hooks/Airport/useGetAllAirport';
import useGetAllPassenger from '@/hooks/Passenger/useGetAllPassenger';
import { IFlightE } from '@/types/Flight.types';
import { IAircraftL } from '@/types/Aircraft.types';
import { IAirportL } from '@/types/Airport.types';
import { IPassengerL } from '@/types/Passenger.types';
import { ITicketE as ITicketTicketE } from '@/types/Ticket.types';
import { tFlightStatus } from '@/enums/tFlightStatus.types';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

interface FlightEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const FlightEFields = ({ isNew = false }: FlightEFieldsProps) => {
  const { data: aircraft, isLoading: aircraftIsLoading } = useGetAllAircraft<IAircraftL>({
    viewName: 'AircraftL',
  });

  const { data: departureAirport, isLoading: departureAirportIsLoading } = useGetAllAirport<IAirportL>({
    viewName: 'AirportL',
  });

  const { data: passenger, isLoading: passengerIsLoading } = useGetAllPassenger<IPassengerL>({
    viewName: 'PassengerL',
  });

  const { control: flightEControl, getValues } = useFormContext<IFlightE>();

  const {
    fields: ticketFields,
    append: appendTicket,
    remove: removeTicket,
  } = useFieldArray({
    control: flightEControl,
    name: 'ticket',
  });

  const ticketColumns: ControlColumnEditor<ITicketTicketE, OptionsEnum, IPassengerL>[] = [
    {
      field: 'ticketNumber',
      title: 'Ticket number',
      editor: 'text',
    },
    {
      field: 'seatNumber',
      title: 'Seat number',
      editor: 'text',
    },
    {
      field: 'price',
      title: 'Price',
      editor: 'number',
    },
    {
      field: 'passengerId',
      title: 'Passenger',
      editor: 'dropdown',
      options: passenger,
      getOptionLabel: (opt) => (opt as IPassengerL).passportNumber?.toString() ?? '',
      required: true,
      rules: {
        validate: (record) => {
          if (!record || record === emptyGuid) {
            return 'Passenger - обязательное поле.';
          }
        },
      },
    },
  ];

  const isLoading = aircraftIsLoading || departureAirportIsLoading || passengerIsLoading;

  if (isLoading) {
    return (
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <CircularProgressCenter />
      </Paper>
    );
  }

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
              id="flightNumber"
              name="flightNumber"
              label="Flight number"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDatePicker
              name="departureTime"
              label="Departure time"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDatePicker
              name="arrivalTime"
              label="Arrival time"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="status"
              label="Status"
              options={tFlightStatus}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="aircraftId"
              label="Aircraft"
              options={aircraft}
              getOptionLabel={(opt) => opt.registrationNumber?.toString() ?? ''}
              required
              rules={{ validate: (record) => (record && record !== emptyGuid) || 'Aircraft - обязательное поле.' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="departureAirportId"
              label="DepartureAirport"
              options={departureAirport}
              getOptionLabel={(opt) => opt.code?.toString() ?? ''}
              required
              rules={{
                validate: (record) => (record && record !== emptyGuid) || 'DepartureAirport - обязательное поле.',
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          Ticket
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={ticketFields}
              name="ticket"
              columns={ticketColumns}
              onCreate={() => {
                appendTicket({
                  id: createUuid(),
                  ticketNumber: '',
                  seatNumber: '',
                  price: 0,
                  passengerId: emptyGuid,
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => ticketFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeTicket(indexesToRemove);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default FlightEFields;
