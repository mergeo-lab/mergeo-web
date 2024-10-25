import { axiosPrivate } from '@/lib/api/axios';
import { AxiosResponse, isAxiosError } from 'axios';
import { DELETE_DROP_ZONE, DROP_ZONE, EDIT_DROP_ZONE } from './endpoints';

import { DropZoneSchemaType, IncomingDropZoneSchemaType } from '@/lib/schemas';
import { timeStringToNumber, transformPolygonToGeoJSON } from '@/lib/utils';

export async function newDropZone({
  companyId,
  body,
}: {
  companyId: string;
  body: DropZoneSchemaType;
}): Promise<IncomingDropZoneSchemaType> {
  try {
    // TODO transform lat, lng to [][]
    const coordinates = transformPolygonToGeoJSON(body.zone.coordinates);
    const schedules = body.schedules.map((schedule) => ({
      ...schedule,
      startHour: schedule.startHour
        ? timeStringToNumber(schedule.startHour)
        : undefined,
      endHour: schedule.endHour
        ? timeStringToNumber(schedule.endHour)
        : undefined,
    }));
    const payload = {
      zone: {
        ...coordinates,
        type: 'Polygon',
      },
      name: body.name,
      schedules: schedules,
    };

    const { data: response }: AxiosResponse = await axiosPrivate.post(
      DROP_ZONE(companyId),
      JSON.stringify({ ...payload }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        error.message = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}

export async function apiEditDropZone({
  id,
  body,
}: {
  id: string;
  body: DropZoneSchemaType;
}): Promise<IncomingDropZoneSchemaType> {
  try {
    const payload: IncomingDropZoneSchemaType = {
      name: '',
      schedules: [],
      zone: { type: '', coordinates: [] },
    };
    if (body.zone) {
      const coordinates =
        body.zone && transformPolygonToGeoJSON(body.zone.coordinates);

      const schedules = body.schedules.map((schedule) => ({
        ...schedule,
        startHour: schedule.startHour ? schedule.startHour : undefined,
        endHour: schedule.endHour ? schedule.endHour : undefined,
      }));

      payload.zone = {
        ...coordinates,
        type: 'Polygon',
      };
      payload.name = body.name;
      payload.schedules = schedules;
    }
    const { data: response }: AxiosResponse = await axiosPrivate.patch(
      EDIT_DROP_ZONE(id),
      JSON.stringify({ ...payload }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        error.message = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}

export async function getDropZones({
  companyId,
}: {
  companyId: string;
}): Promise<IncomingDropZoneSchemaType[]> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.get(
      DROP_ZONE(companyId),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        error.message = 'Algo salio mal, vuelve a intentarlo!';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}

export async function deletDropZone({ id }: { id: string }): Promise<void> {
  try {
    const { data: response }: AxiosResponse = await axiosPrivate.delete(
      DELETE_DROP_ZONE(id),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data.statusCode === 400) {
        error.message = 'El email o la contraseña son incorrectos';
      } else {
        error.message = error.response?.data.message;
      }
    }

    throw error;
  }
}
