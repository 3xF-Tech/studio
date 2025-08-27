"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// This is a separate component to avoid hydration errors.
// The SheetTrigger needs to be a client component, but the parent page is a server component.
// We can't just move the entire chat widget logic out of the sheet,
// as it needs access to `setIsOpen`.
export default function ChatTriggerButton() {
    const { toast } = useToast();

    const handleClick = () => {
        // This is a placeholder for the actual sheet trigger.
        // We're just making sure the button is interactive on the client.
        // The actual chat widget is in a Sheet which handles its own state.
        // This button's real purpose is to be the sheet's trigger, which is handled by radix-ui.
        // For the sake of this component, we can just log to the console
        // or show a toast to confirm it's working.
        console.log("Chat trigger clicked");
    };

    return (
        <Button onClick={handleClick} size="lg" className="w-full">
            Converse com a IA
        </Button>
    )
}
