import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function PersonalForm({ form, onPrevious, onNext, isTransitioning }: PersonalFormProps & { isTransitioning?: boolean }) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-8 mt-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="M" id="male" />
                                        <label htmlFor="male">Male</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="F" id="female" />
                                        <label htmlFor="female">Female</label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <FormControl>
                                <DatePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <FormControl>
                                <Input placeholder="Nigerian" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="current_residence"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Residence</FormLabel>
                            <FormControl>
                                <Input placeholder="Lagos, Nigeria" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrevious}
                    className="w-full"
                    disabled={isTransitioning}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    onClick={onNext}
                    className="w-full"
                    disabled={isTransitioning}
                >
                    {isTransitioning ? "Processing..." : "Continue"}
                </Button>
            </div>
        </div>
    );
}