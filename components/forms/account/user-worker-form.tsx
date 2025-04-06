"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Shield, Table as TableIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const UserGenderEnum = z.enum(['male', 'female']);
const UserRolesEnum = z.enum(['admin', 'worker']);
const UserStatusEnum = z.enum(['widowed', 'single', 'married']);

const UserChildrenSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  middlename: z.string().optional(),
  birthday: z.date(),
  gender: UserGenderEnum,
});

const UserEducationalAttainmentSchema = z.object({
  schoolname: z.string().min(1, "School name is required"),
  education: z.string().min(1, "Education level is required"),
});

const UserCaseSchema = z.object({
  year: z.number().min(1900, "Year must be a valid number"),
  where: z.string().min(1, "Location is required"),
  case: z.string().min(1, "Case description is required"),
  reason: z.string().min(1, "Reason is required"),
  userId: z.number().optional(),
});

const SubjectSchema = z.object({
  name: z.string().min(1, "Subject name is required").optional(),
  description: z.string().min(1, "Description is required"),
  disabled: z.boolean().optional(),
  userId: z.number().optional(),
});

const UserSchema = z.object({
  profilePicture: z.string().optional(),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  middlename: z.string().optional(),
  birthday: z.date(),
  contact: z.string().optional(),
  gender: UserGenderEnum.optional(),
  sss: z.string().optional(),
  sssimage: z.string().optional(),
  pagibig: z.string().optional(),
  pagibigimage: z.string().optional(),
  tin: z.string().optional(),
  tinimage: z.string().optional(),
  psn: z.string().optional(),
  psnimage: z.string().optional(),
  philhealth: z.string().optional(),
  philhealthimage: z.string().optional(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  address: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: UserRolesEnum.optional(),
  description: z.string().optional(),
  status: UserStatusEnum.optional(),
  churchId: z.number().optional(),
  positionId: z.number().optional(),
  children: z.array(UserChildrenSchema).optional(),
  eudcationalAttainment: z.array(UserEducationalAttainmentSchema).optional(),
  cases: z.array(UserCaseSchema).optional(),
  subject: z.array(SubjectSchema).optional(),
});

export default function Home() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      children: [],
      eudcationalAttainment: [],
      cases: [],
      subject: [],
    },
  });

  const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
    control: form.control,
    name: "children",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "eudcationalAttainment",
  });

  const { fields: caseFields, append: appendCase, remove: removeCase } = useFieldArray({
    control: form.control,
    name: "cases",
  });

  const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
    control: form.control,
    name: "subject",
  });

  function onSubmit(values: z.infer<typeof UserSchema>) {
    console.log(values);
    setOpen(false);
  }

  return (
    <div className="p-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex space-x-2.5">
            <Button variant="default" className="gap-2">
              <Shield className="h-4 w-4" />
              Create Admin Account
            </Button>
            <Button variant="outline">
              <TableIcon className="h-5 w-5" /> Export Accounts
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className=" max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Create Worker Account</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new Worker account.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            <div className="space-y-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">Personal Information</h2>

                      <FormField
                        control={form.control}
                        name="firstname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="middlename"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Middle Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Middle name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Birthday</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Marital Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-2xl font-bold">Contact Information</h2>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your address"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Government IDs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="sss"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SSS Number</FormLabel>
                            <FormControl>
                              <Input placeholder="SSS Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pagibig"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pag-IBIG Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Pag-IBIG Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TIN Number</FormLabel>
                            <FormControl>
                              <Input placeholder="TIN Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="philhealth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PhilHealth Number</FormLabel>
                            <FormControl>
                              <Input placeholder="PhilHealth Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Account Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="********" {...field} />
                            </FormControl>
                            <FormDescription>
                              Must be at least 8 characters long
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="worker">Worker</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Children</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendChild({
                          firstname: "",
                          lastname: "",
                          middlename: "",
                          birthday: new Date(),
                          gender: "male"
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Child
                      </Button>
                    </div>

                    {childrenFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Child {index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeChild(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`children.${index}.firstname`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`children.${index}.lastname`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`children.${index}.middlename`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Middle Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`children.${index}.gender`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">Female</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`children.${index}.birthday`}
                              render={({ field }) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Birthday</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Educational Attainment</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendEducation({
                          schoolname: "",
                          education: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>

                    {educationFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`eudcationalAttainment.${index}.schoolname`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>School Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`eudcationalAttainment.${index}.education`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Education Level</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Cases</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendCase({
                          year: new Date().getFullYear(),
                          where: "",
                          case: "",
                          reason: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Case
                      </Button>
                    </div>

                    {caseFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Case {index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCase(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`cases.${index}.year`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Year</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`cases.${index}.where`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`cases.${index}.case`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Case Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`cases.${index}.reason`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reason</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold">Subjects</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSubject({
                          name: "",
                          description: "",
                          disabled: false
                        })}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Button>
                    </div>

                    {subjectFields.map((field, index) => (
                      <Card key={field.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Subject {index + 1}</h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubject(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <FormField
                              control={form.control}
                              name={`subject.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`subject.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              </Form>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}