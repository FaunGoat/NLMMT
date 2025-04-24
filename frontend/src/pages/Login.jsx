import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // get redirect parameter and check if its checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(loginUser({ email, password }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ email và mật khẩu.", {
        duration: 2000,
      });
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Đăng nhập thành công!", {
        duration: 1000,
      });
    } catch (error) {
      const errorMessage = error.message || "Email hoặc mật khẩu không đúng.";
      toast.error(errorMessage, {
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Shaddock.</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">
            Xin chào bạn! ✌️
          </h2>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
              placeholder="Nhập địa chỉ email"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-gray-300 focus:outline-none focus:border-black p-2 text-sm"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Đăng Nhập
          </button>
          <p className="mt-6 text-center text-sm">
            Bạn chưa có tài khoản?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Đăng Ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
