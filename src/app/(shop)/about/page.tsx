'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Award,
  Shield,
  Users,
  TrendingUp,
  Heart,
  Star,
  ChevronRight,
  CheckCircle2,
  Target,
  Globe,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const stats = [
    { label: 'Satisfied Customers', value: '50K+', icon: Heart },
    { label: 'Quality Products', value: '10K+', icon: Award },
    { label: 'Years of Experience', value: '5+', icon: Star },
    { label: 'Cities Covered', value: '63', icon: Globe },
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description:
        'To bring modern fashion style and high quality at reasonable prices to everyone in Vietnam.',
    },
    {
      icon: Award,
      title: 'Quality',
      description:
        '100% commitment to genuine products, rigorously quality tested before reaching customers.',
    },
    {
      icon: Heart,
      title: 'Dedication',
      description:
        'Dedicated consulting team, always listening and supporting customers 24/7.',
    },
  ];

  const team = [
    {
      name: 'Nguyen Minh Tuan',
      position: 'CEO & Founder',
      description:
        'With over 10 years of experience in the fashion industry, Tuan has built Glamora from scratch.',
      avatar: 'https://i.pravatar.cc/300?img=68',
    },
    {
      name: 'Tran Thi Huong',
      position: 'Creative Director',
      description:
        'Design expert with a passion for creativity, creating unique and impressive collections.',
      avatar: 'https://i.pravatar.cc/300?img=47',
    },
    {
      name: 'Le Van Duc',
      position: 'Head of Operations',
      description:
        'Ensures smooth operations, from inventory management to customer delivery.',
      avatar: 'https://i.pravatar.cc/300?img=14',
    },
  ];

  const achievements = [
    'Top 10 trusted fashion brands of 2024',
    'Award for "Most Favorite Product" - Vietnam Fashion Awards',
    'ISO 9001:2015 certification for product quality',
    'Over 1 million orders successfully delivered',
    'Customer satisfaction rate of 98.5%',
    'Expanded to 50+ retail locations nationwide',
  ];

  return (
    <div>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                About Us
              </Badge>
              <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-6xl">
                The Story of{' '}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Glamora
                </span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-gray-600">
                Founded in 2020 with a passion for fashion, Glamora has become
                one of Vietnam&apos;s leading fashion brands, bringing modern
                style and quality to millions of customers.
              </p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                >
                  Explore Collection
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-none text-center shadow-lg transition-all hover:shadow-xl"
                >
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="mb-2 text-3xl font-bold text-orange-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Core Values
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                These values guide all our activities and make Glamora unique
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="group border-none text-center shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-orange-100"
                >
                  <CardContent className="pb-6 pt-8">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 transition-transform duration-300 group-hover:scale-110">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-xl font-bold">{value.title}</h3>
                    <p className="leading-relaxed text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Leadership Team
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                The talented people who have built and developed the Glamora
                brand together
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="group border-none text-center shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <CardContent className="pt-8">
                    <div className="relative mx-auto mb-6 inline-block">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-orange-200 transition-colors duration-300 group-hover:border-orange-400">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-600">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{member.name}</h3>
                    <Badge variant="secondary" className="mb-4">
                      {member.position}
                    </Badge>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                  Achievements & Awards
                </h2>
                <p className="text-lg text-gray-600">
                  Proud milestones in Glamora&apos;s development journey
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 transition-all hover:bg-orange-50"
                  >
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-orange-600" />
                    <span className="text-sm font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Join Glamora
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
              Discover our diverse fashion collection and enjoy an amazing
              shopping experience with us
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                >
                  Shop Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange-600"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
