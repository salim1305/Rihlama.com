import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { User, Bell, Shield, Globe, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated, updateProfile } = useAuth();
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);

	const [profileData, setProfileData] = useState({
		firstName: user?.firstName || '',
		lastName: user?.lastName || '',
		email: user?.email || '',
		phoneNumber: user?.phoneNumber || '',
		dateOfBirth: user?.dateOfBirth || '',
	});

	const [notifications, setNotifications] = useState({
		emailBookings: true,
		emailPromotions: false,
		pushBookings: true,
		pushMessages: true,
		smsBookings: false,
	});

	const [security, setSecurity] = useState({
		twoFactor: false,
		loginAlerts: true,
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	React.useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
		}
	}, [isAuthenticated, navigate]);

	const handleProfileUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
    
		try {
			await updateProfile(profileData);
			toast({
				title: "Profile updated",
				description: "Your profile has been updated successfully.",
			});
		} catch (error) {
			toast({
				title: "Update failed",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handlePasswordChange = async (e) => {
		e.preventDefault();
    
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast({
				title: "Password mismatch",
				description: "New passwords don't match.",
				variant: "destructive",
			});
			return;
		}

		if (passwordData.newPassword.length < 6) {
			toast({
				title: "Password too short",
				description: "Password must be at least 6 characters long.",
				variant: "destructive",
			});
			return;
		}

		setLoading(true);
    
		try {
			// Simulate password change
			setTimeout(() => {
				toast({
					title: "Password updated",
					description: "Your password has been changed successfully.",
				});
				setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
				setLoading(false);
			}, 1000);
		} catch (error) {
			toast({
				title: "Password change failed",
				description: error.message,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
					<p className="text-gray-600">Manage your account preferences and security</p>
				</div>

				<Tabs defaultValue="profile" className="space-y-6">
					<TabsList className="grid w-full grid-cols-4">
						<TabsTrigger value="profile" className="flex items-center space-x-2">
							<User className="h-4 w-4" />
							<span>Profile</span>
						</TabsTrigger>
						<TabsTrigger value="notifications" className="flex items-center space-x-2">
							<Bell className="h-4 w-4" />
							<span>Notifications</span>
						</TabsTrigger>
						<TabsTrigger value="security" className="flex items-center space-x-2">
							<Shield className="h-4 w-4" />
							<span>Security</span>
						</TabsTrigger>
						<TabsTrigger value="preferences" className="flex items-center space-x-2">
							<Globe className="h-4 w-4" />
							<span>Preferences</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="profile" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Personal Information</CardTitle>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleProfileUpdate} className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="firstName">First Name</Label>
											<Input
												id="firstName"
												value={profileData.firstName}
												onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
												disabled={loading}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="lastName">Last Name</Label>
											<Input
												id="lastName"
												value={profileData.lastName}
												onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
												disabled={loading}
											/>
										</div>
									</div>
                  
									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											type="email"
											value={profileData.email}
											onChange={(e) => setProfileData({...profileData, email: e.target.value})}
											disabled={loading}
										/>
									</div>
                  
									<div className="space-y-2">
										<Label htmlFor="phone">Phone Number</Label>
										<Input
											id="phone"
											value={profileData.phoneNumber}
											onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
											placeholder="+212 6XX-XXX-XXX"
											disabled={loading}
										/>
									</div>
                  
									<div className="space-y-2">
										<Label htmlFor="dateOfBirth">Date of Birth</Label>
										<Input
											id="dateOfBirth"
											type="date"
											value={profileData.dateOfBirth}
											onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
											disabled={loading}
										/>
									</div>

									<Button type="submit" disabled={loading} className="rihla-gradient-primary">
										{loading ? 'Updating...' : 'Update Profile'}
									</Button>
								</form>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="notifications" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Email Notifications</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Booking confirmations</Label>
										<p className="text-sm text-gray-600">Get notified about booking updates</p>
									</div>
									<Switch
										checked={notifications.emailBookings}
										onCheckedChange={(checked) => setNotifications({...notifications, emailBookings: checked})}
									/>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Promotions and offers</Label>
										<p className="text-sm text-gray-600">Receive special deals and updates</p>
									</div>
									<Switch
										checked={notifications.emailPromotions}
										onCheckedChange={(checked) => setNotifications({...notifications, emailPromotions: checked})}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Push Notifications</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Booking updates</Label>
										<p className="text-sm text-gray-600">Real-time booking notifications</p>
									</div>
									<Switch
										checked={notifications.pushBookings}
										onCheckedChange={(checked) => setNotifications({...notifications, pushBookings: checked})}
									/>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Messages</Label>
										<p className="text-sm text-gray-600">New messages from hosts</p>
									</div>
									<Switch
										checked={notifications.pushMessages}
										onCheckedChange={(checked) => setNotifications({...notifications, pushMessages: checked})}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="security" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Change Password</CardTitle>
							</CardHeader>
							<CardContent>
								<form onSubmit={handlePasswordChange} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="currentPassword">Current Password</Label>
										<div className="relative">
											<Input
												id="currentPassword"
												type={showCurrentPassword ? 'text' : 'password'}
												value={passwordData.currentPassword}
												onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
												disabled={loading}
											/>
											<button
												type="button"
												className="absolute right-3 top-1/2 transform -translate-y-1/2"
												onClick={() => setShowCurrentPassword(!showCurrentPassword)}
											>
												{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</button>
										</div>
									</div>
                  
									<div className="space-y-2">
										<Label htmlFor="newPassword">New Password</Label>
										<div className="relative">
											<Input
												id="newPassword"
												type={showNewPassword ? 'text' : 'password'}
												value={passwordData.newPassword}
												onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
												disabled={loading}
											/>
											<button
												type="button"
												className="absolute right-3 top-1/2 transform -translate-y-1/2"
												onClick={() => setShowNewPassword(!showNewPassword)}
											>
												{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											</button>
										</div>
									</div>
                  
									<div className="space-y-2">
										<Label htmlFor="confirmPassword">Confirm New Password</Label>
										<Input
											id="confirmPassword"
											type="password"
											value={passwordData.confirmPassword}
											onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
											disabled={loading}
										/>
									</div>

									<Button type="submit" disabled={loading} className="rihla-gradient-primary">
										{loading ? 'Updating...' : 'Change Password'}
									</Button>
								</form>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Security Settings</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Two-factor authentication</Label>
										<p className="text-sm text-gray-600">Add an extra layer of security</p>
									</div>
									<Switch
										checked={security.twoFactor}
										onCheckedChange={(checked) => setSecurity({...security, twoFactor: checked})}
									/>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<div className="space-y-0.5">
										<Label>Login alerts</Label>
										<p className="text-sm text-gray-600">Get notified of new device logins</p>
									</div>
									<Switch
										checked={security.loginAlerts}
										onCheckedChange={(checked) => setSecurity({...security, loginAlerts: checked})}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="preferences" className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>Language & Region</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="language">Language</Label>
									<select className="w-full p-2 border border-gray-300 rounded-md">
										<option value="en">English</option>
										<option value="fr">Français</option>
										<option value="ar">العربية</option>
									</select>
								</div>
                
								<div className="space-y-2">
									<Label htmlFor="currency">Currency</Label>
									<select className="w-full p-2 border border-gray-300 rounded-md">
										<option value="mad">MAD (Moroccan Dirham)</option>
										<option value="eur">EUR (Euro)</option>
										<option value="usd">USD (US Dollar)</option>
									</select>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default Settings;
