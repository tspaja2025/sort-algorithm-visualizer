import { BarsRender } from '@/components/sort-components/bars-render';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { SortElement } from '@/lib/types';

export default function Home() {
  const size = 300;
  const delay = 2;
  const bars: SortElement[] = [];

  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] min-h-screen p-2 gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Sort Algorithm Visualizer</CardTitle>
          <CardDescription>Set of algorithms to visualize</CardDescription>
          <CardAction>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="bitonic">Bitonic</SelectItem>
                  <SelectItem value="bogo">Bogo</SelectItem>
                  <SelectItem value="bubble">Bubble</SelectItem>
                  <SelectItem value="cocktail">Cocktail</SelectItem>
                  <SelectItem value="cycle">Cycle</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                  <SelectItem value="gnome">Gnome</SelectItem>
                  <SelectItem value="heap">Heap</SelectItem>
                  <SelectItem value="insertion">Insertion</SelectItem>
                  <SelectItem value="merge">Merge</SelectItem>
                  <SelectItem value="odd-even">Odd Even</SelectItem>
                  <SelectItem value="pancake">Pancake</SelectItem>
                  <SelectItem value="quick">Quick</SelectItem>
                  <SelectItem value="radix-lsd">Radix LSD</SelectItem>
                  <SelectItem value="radix-msd">Radix MSD</SelectItem>
                  <SelectItem value="selection">Selection</SelectItem>
                  <SelectItem value="shell">Shell</SelectItem>
                  <SelectItem value="stooge">Stooge</SelectItem>
                  <SelectItem value="tim">Tim</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <BarsRender bars={bars}/>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-3 gap-2">
            <Button>Start</Button>
            <Button>Step</Button>
            <Button>Shuffle</Button>
            <Button>Reverse</Button>
            <Button>Valley</Button>
            <Button>Mountain</Button>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label
                htmlFor="arraySize"
                className="flex items-center justify-between"
              >
                <span>Array Size</span>
                <span>300</span>
              </Label>
              <Slider defaultValue={[300]} min={2} max={1024} step={1} />
            </div>
            <div className="grid gap-1">
              <Label
                htmlFor="arrayDelay"
                className="flex items-center justify-between"
              >
                <span>Delay</span>
                <span>2ms</span>
              </Label>
              <Slider defaultValue={[2]} min={0} max={500} step={1} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
