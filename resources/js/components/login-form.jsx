import { cn } from "@/lib/utils";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ className, ...props }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your username and password to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={data.username}
                                onChange={(e) => setData("username", e.target.value)}
                                required
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={processing}>
                            {processing ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <a href="#" className="underline underline-offset-4">
                            Sign up
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
