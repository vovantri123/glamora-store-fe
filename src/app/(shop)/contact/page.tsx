'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Điện thoại',
      info: '+84 123 456 789',
      subInfo: 'T2 - CN: 8:00 - 22:00',
    },
    {
      icon: Mail,
      title: 'Email',
      info: 'support@glamora.vn',
      subInfo: 'Phản hồi trong 24h',
    },
    {
      icon: MapPin,
      title: 'Địa chỉ',
      info: '123 Nguyễn Huệ, Q.1',
      subInfo: 'TP. Hồ Chí Minh',
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      info: '8:00 - 22:00',
      subInfo: 'Tất cả các ngày',
    },
  ];

  return (
    <UserLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
                Liên hệ
              </Badge>
              <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl">
                Chúng tôi luôn sẵn sàng{' '}
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  hỗ trợ bạn
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                Có câu hỏi hoặc cần tư vấn? Đừng ngại liên hệ với chúng tôi!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((item, index) => (
                <Card
                  key={index}
                  className="border-none text-center shadow-lg transition-all hover:shadow-xl"
                >
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                    <p className="mb-1 font-medium text-orange-600">
                      {item.info}
                    </p>
                    <p className="text-sm text-gray-600">{item.subInfo}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <h2 className="mb-6 text-3xl font-bold">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Họ và tên <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Số điện thoại
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0123 456 789"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">
                            Chủ đề <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Tôi muốn hỏi về..."
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Nội dung <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Nhập nội dung tin nhắn của bạn..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        disabled={isSubmitting}
                      >
                        <Send className="mr-2 h-5 w-5" />
                        {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map & Additional Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-6 text-3xl font-bold">Tìm chúng tôi</h2>
                  <Card className="overflow-hidden border-none shadow-lg">
                    <div className="aspect-video bg-gray-200">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2022.9658165605013!2d106.77360137226985!3d10.848150460049602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175270b0505b67f%3A0x9622194f63180632!2zQ28ub3BtYXJ0IFhhIEzhu5kgSMOgIE7hu5lp!5e1!3m2!1svi!2s!4v1761904108239!5m2!1svi!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-full w-full"
                      />
                    </div>
                  </Card>
                </div>

                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-xl font-bold">
                      Câu hỏi thường gặp
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold text-orange-600">
                          Thời gian giao hàng bao lâu?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Đơn hàng nội thành sẽ được giao trong 1-2 ngày, ngoại
                          thành 3-5 ngày làm việc.
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-orange-600">
                          Chính sách đổi trả như thế nào?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Bạn có thể đổi/trả hàng trong vòng 30 ngày kể từ ngày
                          nhận hàng với điều kiện sản phẩm chưa qua sử dụng.
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-semibold text-orange-600">
                          Có hỗ trợ thanh toán online không?
                        </h4>
                        <p className="text-sm text-gray-600">
                          Chúng tôi hỗ trợ nhiều hình thức thanh toán: COD, thẻ
                          ATM, Visa/Mastercard, ví điện tử.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Cần hỗ trợ ngay?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Gọi hotline hoặc chat trực tuyến với chúng tôi
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100"
              >
                <Phone className="mr-2 h-5 w-5" />
                +84 123 456 789
              </Button>
              <Button
                size="lg"
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-orange-600"
              >
                <Mail className="mr-2 h-5 w-5" />
                support@glamora.vn
              </Button>
            </div>
          </div>
        </section>
      </div>
    </UserLayout>
  );
}
