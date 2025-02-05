import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useTruncateText } from '@/hooks/useTruncateText';
import { FilterUser } from '@/types/extended';

type Props = FilterUser

export default function ActiveFilteredUser({ username, image }: Props) {
    const text = useTruncateText(username, 25);
  
    return (
      <Button
        size={"sm"}
        variant={"outline"}
        className="w-fit h-9 flex gap-2 items-center px-2 py-1.5 text-xs rounded-lg"
      >
        <UserAvatar className="w-6 h-6" size={10} profileImage={image} />
        <p className="text-secondary-foreground">{text}</p>
      </Button>
    );
}
