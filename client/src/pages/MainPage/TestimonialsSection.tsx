const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="testimonials section">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-5 info"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <h3>Đáng Giá </h3>
              <p>
                "Chúng tôi cam kết làm việc tận tâm, luôn mang lại dịch vụ chất lượng cao.
                Mỗi bước đi đều hướng đến sự hài lòng của khách hàng, đồng thời tuân thủ chuẩn mực chuyên nghiệp và uy tín."
              </p>
            </div>

            <div className="col-lg-7" data-aos="fade-up" data-aos-delay="200">
              <div className="swiper init-swiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide">
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img
                          src="assets/img/testimonials/testimonials-1.jpg"
                          className="testimonial-img flex-shrink-0"
                          alt=""
                        />
                        <div>
                          <h3>Trần Thị Hà</h3>
                          <h4>Ceo &amp; Founder</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>
                         "Phong cách làm việc chuyên nghiệp, luôn mang lại sự tin tưởng cho khách hàng."
                        </span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img
                          src="assets/img/testimonials/testimonials-2.jpg"
                          className="testimonial-img flex-shrink-0"
                          alt=""
                        />
                        <div>
                          <h3>Nguyễn Văn Thái</h3>
                          <h4>Designer</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>
                          "Dịch vụ nhanh chóng, uy tín và đáng tin cậy."
                        </span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img
                          src="assets/img/testimonials/testimonials-3.jpg"
                          className="testimonial-img flex-shrink-0"
                          alt=""
                        />
                        <div>
                          <h3>Hồ Thị Phượng</h3>
                          <h4>Store Owner</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>
                          "Đội ngũ tận tâm, kỹ năng cao, khiến tôi rất hài lòng."
                        </span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img
                          src="assets/img/testimonials/testimonials-4.jpg"
                          className="testimonial-img flex-shrink-0"
                          alt=""
                        />
                        <div>
                          <h3>Lê Minh Khôi</h3>
                          <h4>Freelancer</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>
                          "Chất lượng và tận tâm, dịch vụ rất tốt"
                        </span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>

                  <div className="swiper-slide">
                    <div className="testimonial-item">
                      <div className="d-flex">
                        <img
                          src="assets/img/testimonials/testimonials-5.jpg"
                          className="testimonial-img flex-shrink-0"
                          alt=""
                        />
                        <div>
                          <h3>Thái Linh Hương</h3>
                          <h4>Entrepreneur</h4>
                          <div className="stars">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                          </div>
                        </div>
                      </div>
                      <p>
                        <i className="bi bi-quote quote-icon-left"></i>
                        <span>
                          "Dịch vụ đi ngang với trách nhiệm, sẽ quay lại đặt lịch khám sau này"
                        </span>
                        <i className="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="swiper-pagination"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default TestimonialsSection;