import { useState } from "react"
import {
    Upload,
    X,
    Tag,
    Weight,
    Package,
    Building,
    AlertCircle,
    CheckCircle,
    ArrowRight,
    Loader2,
    BadgeIndianRupee,
} from "lucide-react";

import { createHookah, uploadImage } from "../../api/adminApi";
import { addHookahPageStyles as s } from "../../assets/dummyStyles";

const InputField = ({
    icon: Icon,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    prefix,
    ...props
}) => (
    <div className={s.inputFieldWrapper}>
        <label className={s.inputFieldLabel}>
            {Icon && <Icon className={s.inputFieldIcon}/>}
            {label}
        </label>
        <div className={s.inputFieldInner}>
            {prefix && <span className={s.inputFieldPrefix}>{prefix}</span>}
            <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="off"
            className={`${s.inputFieldInput} ${prefix ? s.inputFieldInputWithPrefix : ""}`}
            {...props}/>
        </div>

    </div>
)

const AddHookahPage = () => {
    const [form, setform] = useState({
        name: "",
        company: "",
        selling: "",
        original: "",
        weight: ""
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [toast, setToast] = useState({
        show:false,
        message: "",
        type: "success",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => setform({ ...form,[e.target.name] : e.target.value})
    const handleImage = (e) => {
        const file = e.target.files[0];
        if(file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);

        }
    }
    const removeImage = () =>{
        setImage(null);
        setPreview(null);

    };
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type })
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success"});
            if(type === "success") window.location.reload();
        }, 1500);
    }
   
const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, company, selling, original, weight } = form;

    // Validate all fields and image
    if (
        !name.trim() ||
        !company.trim() ||
        !selling.trim() ||
        !original.trim() ||
        !weight.trim() ||
        !image
    ) {
        return showToast(
            "Please fill all fields and upload an image.",
            "error"
        );
    }

    const sellingPrice = Number(selling);
    const oldPrice = Number(original);

    // Validate prices
    if (
        !Number.isFinite(sellingPrice) ||
        !Number.isFinite(oldPrice) ||
        sellingPrice <= 0 ||
        oldPrice < sellingPrice
    ) {
        return showToast(
            "Enter valid prices. Original price must be at least the selling price.",
            "error"
        );
    }

    try {
        setIsSubmitting(true);

        // Upload image
        const imageData = await uploadImage(image);

        if (!imageData?.image?.url || !imageData?.image?.public_id) {
            throw new Error("Invalid image upload response.");
        }

        // Create hookah
        await createHookah({
            image: {
                url: imageData.image.url,
                public_id: imageData.image.public_id,
            },
            name: name.trim(),
            company: company.trim(),
            sellingPrice,
            oldPrice,
            size: weight.trim(),
        });

        // Reset form after successful creation
        setform({
            name: "",
            company: "",
            selling: "",
            original: "",
            weight: "",
        });

        setImage(null);
        setPreview(null);

        showToast(
            imageData.storage === "local"
                ? "Hookah added. Image stored locally because cloud storage is unavailable."
                : "Hookah added successfully.",
            "success"
        );

    } catch (error) {
        console.error("Failed to add hookah:", error);

        showToast(
            error.response?.data?.message || "Failed to add hookah.",
            "error"
        );
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className={s.mainContainer}>


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        /* Override browser autofill background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #000 inset !important;
          -webkit-text-fill-color: #fff !important;
          background-color: #000 !important;
          background: #000 !important;
        }
        input:-moz-autofill {
          background-color: #000 !important;
          color: #fff !important;
        }
        
        .card-glow {
          box-shadow: 0 25px 50px -12px rgba(255, 215, 0, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.03);
        }
        .toast-animate {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .btn-glow {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          box-shadow: 0 8px 24px -6px rgba(251, 191, 36, 0.4);
        }
        .btn-glow:hover {
          box-shadow: 0 12px 32px -6px rgba(251, 191, 36, 0.6);
          transform: translateY(-2px) scale(1.02);
        }
        .upload-area {
          background: radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.03), transparent 70%);
        }
      `}</style>
        {/* Toast */}
        {toast.show && (
            <div className={`${s.toastBase} ${
                toast.type === "success" ? s.toastSuccess : s.toastError
            } tost-animate`}>
                {toast.type === "success" ? (
                    <CheckCircle className={s.toastIconSuccess}/>
                ) : (
                    <AlertCircle className={s.toastIconError}/>
                )}
                <span className={s.toastMessage}>{toast.message}</span>
            </div>
        )}

        {/* Main Card */}
        <div className={s.card}>
            <div className={s.decoGlow1}/>
            <div className={s.decoGlow2} />

            {/* Header */}
            <div className={s.header}>
                <h1 className={s.heading}>
                    <span className={s.headingHighlight}>Add</span>Hookah
                </h1>
                <div className={s.headerBadge}>
                    <Package className={s.headerBadgeIcon}/>
                    <span className={s.headerBadgeText}>New Arrival</span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={s.form}>
                {/* Image upload */}
                <div>
                    <label className={s.uploadLabel}>Hookah Image</label>
                    <div className={`${s.uploadAreaBase} ${
                        preview ? s.uploadAreaWithPreview : s.uploadAreaEmpty
                    }`}>
                        {preview ? (
                            <div className={s.uploadPreviewContainer}>
                                <img src={preview} className={s.uploadPreviewImage} />
                                <button type="button" onClick={removeImage} className={s.removeImageButton}>
                                    <X className={s.iconSm}/>
                                </button>
                            </div>
                        ):(
                            <label className={s.uploadLabelInner}>
                                <div className={s.uploadIconWrapper}>
                                    <Upload className={s.uploadIcon}/>
                                </div>
                                <p className={s.uploadText}>
                                    <span className={s.uploadTextHighlight}>Click to upload</span>{""}
                                    or drag & drop
                                </p>
                                <p className={s.uploadSubtext}>PNG, JPG, WEBP (max 5MB)</p>
                                <input 
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className={s.hiddenInput}/>
                            </label>
                        )}
                    </div>
                </div>
                
          {/* Fields Grid */}
          <div className={s.fieldsGrid}>
            <InputField
              icon={Tag}
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Pharaoh's Crown"
            />
            <InputField
              icon={Weight}
              label="Weight / Size"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 1 set (15 mm)"
            />
            <InputField
              icon={BadgeIndianRupee}
              label="Selling Price"
              type="number"
              name="selling"
              value={form.selling}
              onChange={handleChange}
              placeholder="49.99"
              prefix="₹"
            />
            <InputField
              icon={BadgeIndianRupee}
              label="Original Price"
              type="number"
              name="original"
              value={form.original}
              onChange={handleChange}
              placeholder="69.99"
              prefix="₹"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className={s.companyLabel}>
              <Building className={s.companyIcon} /> Company Name
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              autoComplete="off"
              placeholder="e.g. Hookah Masters LLC"
              className={s.companyInput}
            />
          </div>

          {/* Submit Button */}
          <div className={s.submitWrapper}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${s.submitButton} btn-glow`}
            >
              {isSubmitting ? (
                <Loader2 className={s.submitIcon} />
              ) : (
                <ArrowRight className={s.submitIcon} />
              )}
              <span>{isSubmitting ? "Adding..." : "Add Hookah"}</span>
            </button>
          </div>
  
            </form>
        </div>
  
        </div>
    )
}

export default AddHookahPage;