import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function TutorialModal() {
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem('hasSeeenTutorial') !== 'true';
  });
  const [canClose, setCanClose] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

    if (isAtBottom && !canClose) {
      setCanClose(true);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (canClose && !open) {
          setIsOpen(false);
          localStorage.setItem('hasSeeenTutorial', 'true');
        }
      }}
    >
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto bg-neutral-800"
        ref={contentRef}
        onScroll={handleScroll}
      >
        <DialogHeader>
          <DialogTitle>Welcome to the Employee Scheduling System</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <section>
            <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
            <p>
              Welcome to our Employee Scheduling System. This guide will help
              you understand how to use the main features of the application.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Managing Employees</h3>
            <p>On the left side of the screen, you can:</p>
            <ul className="list-disc pl-6">
              <li>View your list of employees</li>
              <li>Add new employees using the form</li>
              <li>Edit existing employee information</li>
              <li>Remove employees when needed</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Creating Schedules</h3>
            <p>To schedule an employee:</p>
            <ul className="list-disc pl-6">
              <li>Find the employee in the left sidebar</li>
              <li>
                Click and drag the employee's name to the desired day on the
                calendar
              </li>
              <li>
                Drop the employee on the time slot you want to schedule them
              </li>
              <li>Click the "Save" button to confirm the schedule</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Printing Schedules</h3>
            <p>To print your schedule:</p>
            <ul className="list-disc pl-6">
              <li>After saving your schedule changes</li>
              <li>Click the "Print" button at the top of the calendar</li>
              <li>The schedule will be formatted automatically for printing</li>
              <li>Use your browser's print dialog to complete the process</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">Tips</h3>
            <ul className="list-disc pl-6">
              <li>
                You can drag multiple employees to different days to create a
                full schedule
              </li>
              <li>Always remember to save your changes before printing</li>
              <li>
                The schedule will print in landscape orientation for better
                visibility
              </li>
            </ul>
          </section>

          {!canClose && (
            <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm p-4 text-center text-muted-foreground">
              Please scroll to the bottom to continue
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
