import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";


export default function ProfessionalForm({ form, onPrevious, onNext, isTransitioning }: ProfessionalFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="job_title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="job_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Description (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Develop and maintain software applications" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex space-y-4 flex-col">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrevious}
                    className="w-full cursor-pointer"
                    disabled={isTransitioning}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    onClick={onNext}
                    className="w-full cursor-pointer"
                    disabled={isTransitioning}
                >
                    {isTransitioning ? "Processing..." : "Continue"}
                </Button>
            </div>
        </div>
    );
}
