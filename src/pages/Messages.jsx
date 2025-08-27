import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile } from 'lucide-react';
// ...existing code...
// ...existing code...
// ...existing code...
// ...existing code...

// ...existing code...
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
		// ...existing code...
	Search,
		// ...existing code...
		// ...existing code...
		// ...existing code...
	ArrowLeft,
		// ...existing code...
		// ...existing code...
} from 'lucide-react';
import { mockMessages } from '../data/mock';

const Messages = () => {
	const [conversations, setConversations] = useState([]);
	const [activeConversation, setActiveConversation] = useState(null);
	const [newMessage, setNewMessage] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Simulate API call to get conversations
		setConversations(mockMessages);
    
		// Check if mobile
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
    
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const filteredConversations = conversations.filter(conv =>
		conv.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		// Simulate sending message
		console.log('Sending message:', newMessage);
		setNewMessage('');
	};

	const ConversationList = () => (
		<div className={`${isMobile && activeConversation ? 'hidden' : 'block'} w-full md:w-96 border-r bg-white`}>
			{/* Search */}
			<div className="p-4 border-b">
				<h1 className="text-xl font-bold text-gray-900 mb-4">Messages</h1>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<Input
						placeholder="Search conversations..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			{/* Conversations */}
			<div className="overflow-y-auto h-[calc(100vh-200px)]">
				{filteredConversations.length > 0 ? (
					filteredConversations.map((conversation) => (
						<div
							key={conversation.id}
							className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
								activeConversation?.id === conversation.id ? 'bg-green-50 border-r-2 border-r-green-600' : ''
							}`}
							onClick={() => setActiveConversation(conversation)}
						>
							<div className="flex items-start space-x-3">
								<div className="relative">
									<Avatar>
										<AvatarImage src="/api/placeholder/40/40" alt={conversation.senderName} />
										<AvatarFallback>{conversation.senderName.charAt(0)}</AvatarFallback>
									</Avatar>
									{conversation.unread && (
										<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full"></div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-1">
										<h3 className="font-medium text-gray-900 truncate">
											{conversation.senderName}
										</h3>
										<span className="text-xs text-gray-500">
											{new Date(conversation.timestamp).toLocaleDateString()}
										</span>
									</div>
									<p className="text-sm text-gray-600 line-clamp-2 mb-1">
										{conversation.lastMessage}
									</p>
									{conversation.unread && (
										<Badge className="bg-green-600 text-white text-xs">New</Badge>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className="p-8 text-center">
						<div className="text-gray-400 mb-2">
							<Search className="h-8 w-8 mx-auto" />
						</div>
						<p className="text-gray-500">No conversations found</p>
					</div>
				)}
			</div>
		</div>
	);

	const ChatWindow = () => {
		if (!activeConversation) {
			return (
				<div className="flex-1 flex items-center justify-center bg-gray-50">
					<div className="text-center">
						<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
							<Send className="h-8 w-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
						<p className="text-gray-500">Choose a conversation from the list to start messaging</p>
					</div>
				</div>
			);
		}

		return (
			<div className={`${isMobile && !activeConversation ? 'hidden' : 'flex'} flex-1 flex flex-col bg-white`}>
				{/* Chat Header */}
				<div className="flex items-center justify-between p-4 border-b bg-white">
					<div className="flex items-center space-x-3">
						{isMobile && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setActiveConversation(null)}
							>
								<ArrowLeft className="h-4 w-4" />
							</Button>
						)}
						<Avatar>
							<AvatarImage src="/api/placeholder/40/40" alt={activeConversation.senderName} />
							<AvatarFallback>{activeConversation.senderName.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="font-medium text-gray-900">{activeConversation.senderName}</h3>
							<p className="text-sm text-gray-500">Online 2 hours ago</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="sm">
							<Phone className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm">
							<Video className="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="sm">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
					{/* Sample messages */}
					<div className="flex">
						<div className="flex items-start space-x-2">
							<Avatar className="w-8 h-8">
								<AvatarImage src="/api/placeholder/32/32" alt={activeConversation.senderName} />
								<AvatarFallback className="text-xs">{activeConversation.senderName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="bg-white rounded-lg px-4 py-2 max-w-xs shadow-sm">
								<p className="text-sm text-gray-900">
									Hi! I'm excited about the desert experience. What should I bring?
								</p>
								<span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
							</div>
						</div>
					</div>

					<div className="flex justify-end">
						<div className="bg-green-600 text-white rounded-lg px-4 py-2 max-w-xs">
							<p className="text-sm">
								Great question! I'll send you a packing list. The desert can be cool at night so bring warm clothes!
							</p>
							<span className="text-xs text-green-100 mt-1 block">10:35 AM</span>
						</div>
					</div>

					<div className="flex">
						<div className="flex items-start space-x-2">
							<Avatar className="w-8 h-8">
								<AvatarImage src="/api/placeholder/32/32" alt={activeConversation.senderName} />
								<AvatarFallback className="text-xs">{activeConversation.senderName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="bg-white rounded-lg px-4 py-2 max-w-xs shadow-sm">
								<p className="text-sm text-gray-900">
									{activeConversation.lastMessage}
								</p>
								<span className="text-xs text-gray-500 mt-1 block">
									{new Date(activeConversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Message Input */}
				<form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
					<div className="flex items-end space-x-2">
						<div className="flex-1 relative">
							<Input
								placeholder="Type a message..."
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								className="pr-20"
								rows={1}
							/>
							<div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
								<Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0">
									<Paperclip className="h-3 w-3" />
								</Button>
								<Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0">
									<Smile className="h-3 w-3" />
								</Button>
							</div>
						</div>
						<Button 
							type="submit" 
							disabled={!newMessage.trim()}
							className="bg-green-600 hover:bg-green-700"
						>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</form>
			</div>
		);
	};

	return (
		<div className="h-screen bg-gray-100">
			<div className="h-full max-w-7xl mx-auto flex">
				<ConversationList />
				<ChatWindow />
			</div>
		</div>
	);
};

export default Messages;
