import { dummy_schedule } from "@/const/dummy_scedule";
import { Form } from "@heroui/form";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { RadioGroup, Radio } from "@heroui/radio";
import { Button } from "@heroui/button";
export default function Register() {
  return (
    <>
      <h1 className="text-2xl font-bold">ダミー日程調整</h1>
      <div>
        <Form className="flex flex-col gap-5 min-w-[450px] justify-center items-center">
          {dummy_schedule.map((schedule) => (
            <Card key={schedule.id} className="flex flex-col w-full">
              <CardHeader className="">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold">{schedule.date}</p>
                  <p className="text-lg font-bold">{schedule.start_time} - {schedule.end_time}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <RadioGroup orientation="horizontal">
                  <Radio value="ok">参加</Radio>
                  <Radio value="late">途中参加</Radio>
                  <Radio value="leave">途中退出</Radio>
                  <Radio value="cancel">不参加</Radio>
                </RadioGroup>
              </CardBody>
            </Card>
          ))}
          <Button color="primary" className="">登録する</Button>
        </Form>
      </div>
    </>
  );
}
