import { supabase } from "./supabase";
import type { Message } from '../types/message';
import type { Profile } from '../types/profile';

export const fetchProfilesFromDB = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .order('name');
  
  if (error) throw new Error(error.message);
  return data as Profile[];
};

export const fetchConversationFromDB = async (
  currentUserId: string,
  otherUserId:string
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender_id.eq.${currentUserId}, receiver_id.eq.${otherUserId}),` +
      `and(sender_id.eq.${otherUserId}, receiver_id.eq.${currentUserId})`
    )
    .order('created_at', { ascending: true });
  
  if (error) throw new Error(error.message);
  return data as Message[];
}

export const sendMessageToDB = async (
  message: Omit<Message, 'id' | 'created_at' | 'is_read' | 'sender' | 'receiver'>
): Promise <Message> => {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ ...message, is_read: false}])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Message;
};


export const markMessagesReadInDB = async (
  senderId: string,
  receiverId: string
): Promise<void> => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);

};

 export const fetchUnreadCountsFromDB = async (
  currentUserId: string
 ): Promise<Record<string, number>> => {
  const { data, error } = await supabase
    .from('messages')
    .select('sender_id')
    .eq('receiver_id', currentUserId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);

  const counts: Record<string, number> = {};
  (data || []).forEach((msg) => {
    counts[msg.sender_id] = (counts[msg.sender_id] || 0) + 1;
  });
  return counts;
 };

 export const subscribeToMessages = (
  currentUserId: string,
  onNewMessage: (message: Message) => void
 ) => {
  const channel = supabase 
    .channel(`messages_${currentUserId}`)
    .on(
      'postgres_changes',

      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
 };
