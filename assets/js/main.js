// --- Gemini API Integration ---
async function analyzeProjectWithAI() {
  const input = document.getElementById('ai-project-desc').value;
  const resultBox = document.getElementById('ai-result');
  const resultContent = document.getElementById('ai-result-content');
  const btn = document.getElementById('ai-btn');
  
  if (!input || input.trim() === "") {
    alert("الرجاء إدخال وصف للمشروع أولاً");
    return;
  }

  // UI Loading State
  const originalBtnText = btn.innerHTML;
  btn.innerHTML = '<span>جاري التحليل...</span> <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  resultBox.style.display = 'none';

  // ملاحظة أمنية: يفضل دائماً نقل مفتاح API إلى الخادم (Backend)
  const apiKey = ""; // سيتم تعبئته عند التشغيل إذا كان متوفراً في البيئة
  const prompt = `بصفتك خبير تسويق رقمي محترف، قم بتحليل المشروع التالي واقترح 3 نصائح تسويقية استراتيجية ومبتكرة وقابلة للتنفيذ. 
  وصف المشروع: "${input}"
  
  الرجاء تقديم الإجابة كنقاط مختصرة وواضحة باللغة العربية.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
        // تنسيق بسيط للنص الناتج
        resultContent.innerHTML = text.replace(/\n/g, '<br>').replace(/\*/g, '');
        resultBox.style.display = 'block';
        
        // تمرير سلس للنتيجة
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        throw new Error("No text returned");
    }

  } catch (error) {
    console.error("AI Error:", error);
    alert("عذراً، حدث خطأ أثناء الاتصال بالمستشار الذكي. يرجى المحاولة لاحقاً.");
  } finally {
    // Reset Button
    btn.innerHTML = originalBtnText;
    btn.disabled = false;
  }
}

// --- Contact Form Handling ---
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerText;
  
  btn.innerText = 'جاري الإرسال... ⏳';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value || 'لا يوجد تفاصيل إضافية',
      date: new Date().toLocaleDateString('ar-SA')
  };

  try {
      // Webhook URL
      const webhookUrl = "https://hook.eu1.make.com/m0r5843oyetl2f111beqnydz3yd3uust"; 

      const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
      });

      if (response.ok) {
          btn.innerText = 'تم الإرسال بنجاح ✅';
          btn.style.backgroundColor = '#7EDDA3';
          btn.style.color = '#000';
          btn.style.border = 'none';
          
          document.getElementById('contactForm').reset();
          
          setTimeout(() => {
              btn.innerText = originalText;
              btn.disabled = false;
              btn.style.opacity = '1';
              btn.style.backgroundColor = ''; 
              btn.style.color = '';
              btn.style.border = '';
          }, 3000);
      } else {
          throw new Error('Server response not ok');
      }

  } catch (error) {
      console.error('Error:', error);
      btn.innerText = 'حدث خطأ! ❌';
      btn.style.backgroundColor = '#ff6b6b';
      
      setTimeout(() => {
          btn.innerText = originalText;
          btn.disabled = false;
          btn.style.backgroundColor = '';
      }, 3000);
      
      alert("عذرًا، حدث خطأ في الاتصال. يرجى المحاولة لاحقًا أو التواصل عبر الواتساب.");
  }
}

// --- FAQ Accordion ---
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        const wasActive = item.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        if (!wasActive) {
          item.classList.add('active');
        }
      });
    });

    // --- Smooth Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
});
