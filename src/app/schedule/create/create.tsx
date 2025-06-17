"use client";

import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Badge } from "@heroui/badge";
import { FaArrowLeft } from "react-icons/fa";
import { LuUsersRound, LuPartyPopper } from "react-icons/lu";
import { CiClock1, CiForkAndKnife, CiPlane } from "react-icons/ci";

import Link from "next/link";

const eventTypes = [
    {
        id: "meal",
        name: "ご飯・飲み会",
        icon: CiForkAndKnife,
        description: "3-4時間程度のカジュアルな集まり",
        color: "bg-orange-500",
        duration: "3-4時間",
        participants: "3-8人",
        features: ["時間帯重視", "サクッと決定", "当日変更OK"],
    },
    {
        id: "trip",
        name: "旅行・合宿",
        icon: CiPlane,
        description: "1泊以上の宿泊を伴うイベント",
        color: "bg-blue-500",
        duration: "1泊〜",
        participants: "5-15人",
        features: ["日程重視", "早めの確定", "宿泊手配必要"],
    },
    {
        id: "event",
        name: "大型イベント",
        icon: LuPartyPopper,
        description: "新歓・歓送迎会など大人数のイベント",
        color: "bg-purple-500",
        duration: "2-6時間",
        participants: "15人以上",
        features: ["全員参加前提", "代替案自動提案", "出欠管理"],
    },
];

export default function CreatePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>("");
    const [title, setTitle] = useState("");

    const handleNext = () => {
        if (selectedType && title) {
            router.push(
                `/schedule/create/${selectedType}?title=${encodeURIComponent(title)}`
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
            <div className="mx-auto px-4 py-6">
                <div className="mb-6">
                    <Link href="/">
                        <Button variant="ghost" className="mb-4 h-12 px-4">
                            <FaArrowLeft className="w-5 h-5 mr-2" />
                            ホームに戻る
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        どんなイベント？
                    </h1>
                    <p className="text-sm text-gray-600">
                        イベントの種類を選ぶと最適な入力方法になります
                    </p>
                </div>

                <div className="space-y-4 mb-6" >
                    <div>
                        <label
                            htmlFor="title"
                            className="text-base font-medium"
                        >
                            イベント名
                        </label>
                        <Input
                            id="title"
                            placeholder="例：ゼミ飲み会、春合宿、新歓パーティー"
                            value={title}
                            onChange={(e: {
                                target: { value: SetStateAction<string> };
                            }) => setTitle(e.target.value)}
                            className="h-12 text-base mt-2"
                        />
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    {eventTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <Card
                                key={type.id}
                                className={`cursor-pointer transition-all ${
                                    selectedType === type.id
                                        ? "ring-2 ring-blue-500 bg-blue-50"
                                        : "hover:shadow-md"
                                }`}
                                fullWidth
                                isPressable
                                onPress={() => {
                                    setSelectedType(type.id);
                                }}
                            >
                                <div className="flex items-start gap-3" >
                                    <div
                                        className={`${type.color} p-2 rounded-lg`}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base mb-1">
                                            {type.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            {type.description}
                                        </p>

                                        <div className="flex gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                <CiClock1 className="w-3 h-3 text-gray-500" />
                                                <span className="text-xs text-gray-600">
                                                    {type.duration}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <LuUsersRound className="w-3 h-3 text-gray-500" />
                                                <span className="text-xs text-gray-600">
                                                    {type.participants}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {type.features.map(
                                                (feature, index) => (
                                                    <Badge
                                                        key={index}
                                                        className="text-xs"
                                                    >
                                                        {feature}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <Button
                    onPress={handleNext}
                    disabled={!selectedType || !title}
                    className="w-full h-12 text-base"
                >
                    次へ進む
                </Button>
            </div>
        </div>
    );
}
