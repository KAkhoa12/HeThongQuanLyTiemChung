
const FaqSection = () => {
    return (
        <section id="faq" className="faq section light-background">
        <div className="container section-title" data-aos="fade-up">
          <h2>Câu hỏi thường gặp</h2>
          <p>
            "Giải pháp đúng nhu cầu"
          </p>
           <hr className="soft-hr" />
        </div>

        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10" data-aos="fade-up" data-aos-delay="100">
              <div className="faq-container">
                <div className="faq-item faq-active">
                  <h3>1. Tôi có cần lo lắng về tình trạng sức khỏe hiện tại không?</h3>
                  <div className="faq-content">
                    <p>
                      Không cần quá lo lắng, hãy duy trì lối sống lành mạnh và theo dõi thường xuyên.
                    </p>
                  </div>
                  <i className="faq-toggle bi bi-chevron-right"></i>
                  <hr className="item-hr d-lg-none" />
                </div>

                <div className="faq-item">
                  <h3>2. Sự thay đổi lối sống có ảnh hưởng nhiều không?</h3>
                  <div className="faq-content">
                    <p>
                      Có, một số thay đổi nhỏ hàng ngày có thể mang lại sức khỏe lâu dài.
                    </p>
                  </div>
                  <i className="faq-toggle bi bi-chevron-right"></i>
                  <hr className="item-hr d-lg-none" />
                </div>

                <div className="faq-item">
                  <h3>
                   3. Làm thế nào để duy trì thói quen tốt?
                  </h3>
                  <div className="faq-content">
                    <p>
                      Hãy bắt đầu từ những việc nhỏ, duy trì đều đặn sẽ tốt hơn là cầu toàn.
                    </p>
                  </div>
                  <i className="faq-toggle bi bi-chevron-right"></i>
                  <hr className="item-hr d-lg-none" />
                </div>

                <div className="faq-item">
                  <h3>
                   4. Tôi có nên bắt đầu ngay không?
                  </h3>
                  <div className="faq-content">
                    <p>
                      Có, hãy bắt đầu từ hôm nay. Mỗi bước đi nhỏ đều có giá trị lớn.
                    </p>
                  </div>
                  <i className="faq-toggle bi bi-chevron-right"></i>
                  <hr className="item-hr d-lg-none" />
                </div>

                <div className="faq-item">
                  <h3>
                    5. Thời gian có ảnh hưởng đến kết quả không?
                  </h3>
                  <div className="faq-content">
                    <p>
                     Có, sự kiên trì theo thời gian là yếu tố quyết định thành công.
                    </p>
                  </div>
                  <i className="faq-toggle bi bi-chevron-right"></i>
                  <hr className="item-hr d-lg-none" />
                </div>

                <div className="faq-item">
                  <h3>6. Làm sao để vượt qua khó khăn và thử thách?</h3>
                  <div className="faq-content">
                    <p>
                      Hãy tin tưởng vào bản thân, tìm sự hỗ trợ từ gia đình và chuyên gia.
                    </p>
                  </div>
                  <i className="faq-toggle bi bi-chevron-right"></i>
                </div>
              </div>
              <hr className="item-hr d-lg-none" />
            </div>
          </div>
        </div>
      </section>
    );
};

export default FaqSection;