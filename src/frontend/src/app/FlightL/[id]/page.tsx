'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import FlightEFields from '@/modules/FormFields/FlightEFields';
import useGetFlight from '@/hooks/Flight/useGetFlight';
import useUpdateFlight from '@/hooks/Flight/useUpdateFlight';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { ITicketE } from '@/types/Ticket.types';
import { tFlightStatus } from '@/enums/tFlightStatus.types';
import { IFlightE } from '@/types/Flight.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

export default function FlightPageEdit() {
  const viewName: string = 'FlightE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.FLIGHT_L);
  };

  const { data, isLoading } = useGetFlight<IFlightE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

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

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateFlightAsync } = useUpdateFlight<IFlightE>(handleSuccess, handleError);

  const handleSave = async (newValue: IFlightE, close: boolean) => {
    setCloseAfter(close);
    await updateFlightAsync({ flight: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.FLIGHT_L}${getQueryParamStateId(searchParams)}`);
  };

  useEffect(() => {
    if (!isLoading && data) {
      methods.reset(data);
    }
  }, [data, isLoading, methods]);

  if (isLoading) {
    return <CircularProgressCenter />;
  }

  return (
    <FormProvider {...methods}>
      <DisabledFormProvider disabled={mode === 'readonly'}>
        <Box component="form">
          <EditFormToolbar
            title="Flight"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <FlightEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
