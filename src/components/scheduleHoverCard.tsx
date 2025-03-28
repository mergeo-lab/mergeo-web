import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PickUpSchedulesSchemaType } from "@/lib/schemas";
import { numberToTimeString } from "@/lib/utils";


function groupSchedulesByDay(schedules: PickUpSchedulesSchemaType[]) {
    const groupedSchedules: { [day: string]: PickUpSchedulesSchemaType[] } = {};

    schedules.forEach((schedule) => {
        if (!groupedSchedules[schedule.day]) {
            groupedSchedules[schedule.day] = [];
        }
        groupedSchedules[schedule.day].push(schedule);
    });

    return groupedSchedules;
}

export default function ScheduleHoverCard({ schedules }: { schedules: PickUpSchedulesSchemaType[] }) {
    const groupedSchedules = groupSchedulesByDay(schedules);

    return (
        <div className="flex gap-2 flex-wrap z-20">
            {Object.keys(groupedSchedules).map((day) => (
                <HoverCard key={day}>
                    <HoverCardTrigger>
                        <div className="flex justify-center items-center text-secondary bg-white rounded-full cursor-pointer hover:opacity-70 text-sm w-7 h-7 inset-0 shadow">
                            {day.slice(0, 2).toUpperCase()}
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit z-20">
                        <div className="flex flex-col">
                            <Table className="table-fixed w-fit">
                                <TableHeader>
                                    <TableRow className="hover:bg-white">
                                        <TableHead className="m-0">Desde</TableHead>
                                        <TableHead className="m-0 w-[2px]"></TableHead>
                                        <TableHead className="m-0">Hasta</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {groupedSchedules[day].map((schedule) => (
                                        <TableRow key={schedule.id} className="hover:bg-white w-full h-2 odd:bg-muted/20 hover:bg-muted/30">
                                            <TableCell className="h-2 py-2">
                                                {numberToTimeString(schedule.startHour)}
                                            </TableCell>
                                            <TableCell className="w-fit h-2 py-2">
                                                -
                                            </TableCell>
                                            <TableCell className="h-2 py-2">
                                                {numberToTimeString(schedule.endHour)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            ))}
        </div>
    );
}
