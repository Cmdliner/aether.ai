import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BloodGroupEnum, GenotypeEnum } from "@/lib/enums";


// Convert enums to proper format for form validation
const bloodGroups = Object.values(BloodGroupEnum).filter(value => typeof value === 'string');
const genotypes = Object.values(GenotypeEnum).filter(value => typeof value === 'string');


export default function MedicalForm({ form, onPrevious, onSubmit, isTransitioning, isLoading }: MedicalFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allergies (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Peanuts, Seafood, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="blood_group"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Blood Group (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {bloodGroups.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group.replace('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="genotype"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Genotype (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select genotype" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {genotypes.map((genotype) => (
                                        <SelectItem key={genotype} value={genotype}>
                                            {genotype}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="known_conditions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Known Medical Conditions (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Asthma, Diabetes, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="flex flex-col space-y-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onPrevious}
                    className="w-full cursor-pointer"
                    disabled={isTransitioning || isLoading}
                >
                    Previous
                </Button><Button
                    onClick={onSubmit}
                    className="w-full cursor-pointer"
                    disabled={isTransitioning || isLoading}
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
            </div>
        </div>
    );
}