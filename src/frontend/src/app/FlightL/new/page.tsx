'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import FlightEFields from '@/modules/FormFields/FlightEFields';
import useCreateFlight from '@/hooks/Flight/useCreateFlight';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';
import { tFlightStatus } from '@/enums/tFlightStatus.types';
import { ITicketE } from '@/types/Ticket.types';
import { IFlightE } from '@/types/Flight.types';

export default function FlightPageNew() {
  const viewName: string = 'FlightE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IFlightE>({
    defaultValues: {
      id: createUuid(),
      flightNumber: '',
      departureTime: new Date(),
      arrivalTime: new Date(),
      status: tFlightStatus.ARRIVED,
      aircraftId: emptyGuid,
      departureAirportId: emptyGuid,
      ticket: [] as ITicketE[],
    },
  });

  const handleSuccess = (newRecord: IFlightE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.FLIGHT_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createFlightAsync } = useCreateFlight<IFlightE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.FLIGHT_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Flight"
          onSave={async (newValue: IFlightE, close: boolean) => {
            setCloseAfter(close);
            await createFlightAsync({ flight: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <FlightEFields isNew />
      </Box>
    </FormProvider>
  );
}
