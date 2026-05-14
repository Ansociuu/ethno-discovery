import sgMail from '@sendgrid/mail';

// Cấu hình SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const SENDER = process.env.EMAIL_FROM || 'EthnoDiscovery <no-reply@ethnodiscovery.vn>';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount).replace('₫', ' VNĐ');
};

const EMAIL_STYLE = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #1A1028;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eee;
`;

const HEADER_STYLE = `
  background: linear-gradient(135deg, #FF3CAC 0%, #E63946 100%);
  padding: 40px 20px;
  text-align: center;
`;

export const sendBookingPendingEmail = async (
  email: string,
  name: string,
  bookingId: number,
  itemName: string,
  amount: number,
  paymentLink: string
) => {
  try {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your_api_key')) {
      console.log(`[Email Mock - SendGrid] To: ${email} | Subject: Chờ thanh toán | Booking: #${bookingId}`);
      return;
    }
    
    const msg = {
      from: SENDER,
      to: email,
      subject: `[EthnoDiscovery] Xác nhận đơn đặt chỗ #${bookingId} - Vui lòng thanh toán`,
      html: `
        <div style="${EMAIL_STYLE}">
          <div style="${HEADER_STYLE}">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">EthnoDiscovery</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #FF3CAC; margin-top: 0;">Xin chào ${name},</h2>
            <p style="font-size: 16px;">Cảm ơn bạn đã lựa chọn EthnoDiscovery. Đơn đặt chỗ của bạn đã được ghi nhận và đang chờ thanh toán để xác nhận chính thức.</p>
            
            <div style="background: #FFF9E6; padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #FFD60A;">
              <h3 style="margin-top: 0; color: #1A1028; font-size: 18px;">Chi tiết đơn hàng #${bookingId}</h3>
              <p style="margin: 10px 0; font-size: 15px;"><strong>Dịch vụ:</strong> ${itemName}</p>
              <p style="margin: 10px 0; font-size: 15px;"><strong>Tổng thanh toán:</strong> <span style="color: #E63946; font-weight: 800; font-size: 20px;">${formatCurrency(amount)}</span></p>
            </div>

            <p style="font-size: 14px; color: #666;">Vui lòng hoàn tất thanh toán trong vòng 24 giờ để giữ chỗ. Sau thời gian này, đơn hàng sẽ tự động bị huỷ trên hệ thống.</p>
            
            <div style="text-align: center; margin-top: 40px;">
              <a href="${paymentLink}" style="display: inline-block; background: #FF3CAC; color: #ffffff; text-decoration: none; padding: 18px 45px; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 20px rgba(255, 60, 172, 0.3);">Thanh Toán Ngay</a>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">Đây là email tự động từ hệ thống. Nếu bạn cần hỗ trợ, vui lòng liên hệ hotline: 0987.xxx.xxx hoặc phản hồi email này.</p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
  } catch (err: any) {
    if (err.response) {
      console.error('SendGrid Error (Pending):', err.response.body);
    } else {
      console.error('Failed to send pending email with SendGrid:', err);
    }
  }
};

export const sendPaymentSuccessEmail = async (
  email: string,
  name: string,
  bookingId: number,
  itemName: string
) => {
  try {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your_api_key')) {
      console.log(`[Email Mock - SendGrid] To: ${email} | Subject: Thanh toán thành công | Booking: #${bookingId}`);
      return;
    }

    const msg = {
      from: SENDER,
      to: email,
      subject: `[EthnoDiscovery] Thanh toán thành công - Đơn hàng #${bookingId}`,
      html: `
        <div style="${EMAIL_STYLE}">
          <div style="${HEADER_STYLE}">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">EthnoDiscovery</h1>
          </div>
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
               <div style="width: 80px; height: 80px; background: #E8F5E9; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
                  <span style="color: #4CAF50; font-size: 40px;">✓</span>
               </div>
               <h2 style="color: #4CAF50; margin-top: 20px; font-size: 24px;">Thanh toán thành công!</h2>
            </div>

            <p style="font-size: 16px;">Xin chào ${name},</p>
            <p style="font-size: 16px;">Chúc mừng! Chúng tôi đã nhận được thanh toán cho đơn hàng <strong>#${bookingId}</strong>.</p>
            <p style="font-size: 16px;">Dịch vụ <strong>${itemName}</strong> của bạn đã được xác nhận chính thức. Chúng tôi đang chuẩn bị những điều tuyệt vời nhất cho chuyến đi của bạn.</p>
            
            <div style="background: #F5F1FF; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; border: 1px solid #FF3CAC;">
              <p style="margin: 0; font-size: 16px; color: #1A1028; font-weight: 500;">Mọi thông tin chi tiết về lịch trình và hướng dẫn nhận phòng sẽ được gửi cho bạn qua Zalo/Email trong vòng 24h tới.</p>
            </div>

            <p style="text-align: center; font-size: 18px; color: #FF3CAC; font-weight: bold; margin-top: 40px;">Hẹn gặp bạn trong hành trình khám phá Tây Bắc!</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 40px 0;" />
            <p style="font-size: 12px; color: #999; text-align: center;">Trân trọng,<br/>Đội ngũ EthnoDiscovery</p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
  } catch (err: any) {
    if (err.response) {
      console.error('SendGrid Error (Success):', err.response.body);
    } else {
      console.error('Failed to send success email:', err);
    }
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your_api_key')) {
      console.log(`[Email Mock] Welcome Email to: ${email}`);
      return;
    }

    const msg = {
      from: SENDER,
      to: email,
      subject: 'Chào mừng bạn đến với EthnoDiscovery!',
      html: `
        <div style="${EMAIL_STYLE}">
          <div style="${HEADER_STYLE}">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">EthnoDiscovery</h1>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #FF3CAC;">Chào mừng ${name}!</h2>
            <p style="font-size: 16px;">Chúng tôi rất vui mừng khi bạn gia nhập cộng đồng khám phá văn hoá Tây Bắc của EthnoDiscovery.</p>
            <p style="font-size: 16px;">Giờ đây bạn có thể đặt những tour du lịch độc bản, lưu trú tại những homestay mang đậm bản sắc và sử dụng AI Journey Planner để lên lịch trình hoàn hảo.</p>
            <div style="margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #FF3CAC; color: #ffffff; text-decoration: none; padding: 15px 35px; border-radius: 50px; font-weight: bold;">Khám Phá Ngay</a>
            </div>
          </div>
        </div>
      `
    };
    await sgMail.send(msg);
  } catch (err: any) {
    if (err.response) {
      console.error('SendGrid Error (Welcome):', err.response.body);
    } else {
      console.error('Failed to send welcome email:', err);
    }
  }
};

export const sendOTPEmail = async (email: string, name: string, otp: string) => {
  try {
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY.includes('your_api_key')) {
      console.log(`[Email Mock] OTP Email to: ${email} | OTP: ${otp}`);
      return;
    }

    const msg = {
      from: SENDER,
      to: email,
      subject: `[EthnoDiscovery] Mã xác thực của bạn: ${otp}`,
      html: `
        <div style="${EMAIL_STYLE}">
          <div style="${HEADER_STYLE}">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">EthnoDiscovery</h1>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="color: #1A1028;">Mã xác thực của bạn</h2>
            <p style="font-size: 16px; color: #666;">Dùng mã này để hoàn tất quy trình quên mật khẩu. Mã có hiệu lực trong 10 phút.</p>
            <div style="margin: 30px 0; background: #F5F1FF; padding: 20px; border-radius: 12px; border: 1px dashed #FF3CAC;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #FF3CAC;">${otp}</span>
            </div>
            <p style="font-size: 12px; color: #999;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ.</p>
          </div>
        </div>
      `
    };
    await sgMail.send(msg);
  } catch (err: any) {
    if (err.response) {
      console.error('SendGrid Error Body:', err.response.body);
    } else {
      console.error('Failed to send OTP email:', err);
    }
  }
};
