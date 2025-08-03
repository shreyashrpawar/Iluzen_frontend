import Navbar from "../components/Navbar";
import ProtectedRoute from "@/components/protected-route";
export default function DashboardPage() {
    return (
        <ProtectedRoute>
        <Navbar/>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Dashboard</h1>
                <p className="text-center">Welcome to your dashboard!</p>
            </div>
        </div>
        </ProtectedRoute>
    );
}
