import {
  useGetAppointments,
  useUpdateAppointmentStatus,
} from "@/hooks/use-appointment";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { AppointmentStatus } from "@prisma/client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

function RecentAppointments() {
  const { data: appointments = [] } = useGetAppointments();
  const updateAppointmentMutation = useUpdateAppointmentStatus();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleAppointmentStatus = (appointmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);

    let newStatus: AppointmentStatus = AppointmentStatus.CONFIRMED;

    if (appointment?.status === AppointmentStatus.CONFIRMED)
      newStatus = AppointmentStatus.COMPLETED;
    else if (appointment?.status === AppointmentStatus.COMPLETED)
      newStatus = AppointmentStatus.REJECTED;
    else if (appointment?.status === AppointmentStatus.REJECTED)
      newStatus = AppointmentStatus.CONFIRMED;

    updateAppointmentMutation.mutate({ id: appointmentId, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Recent Appointments
        </CardTitle>
        <CardDescription>
          Monitor and manage all patient appointments
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {appointment.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.patientEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {appointment.doctorName}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleToggleAppointmentStatus(appointment.id)
                      }
                      className="h-6 px-2"
                    >
                      {getStatusBadge(appointment.status)}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-xs text-muted-foreground">
                      Click status to toggle
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentAppointments;
